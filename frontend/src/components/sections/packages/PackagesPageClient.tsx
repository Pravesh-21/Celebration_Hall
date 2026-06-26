'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PackagesGrid from '@/components/sections/packages/PackagesGrid';
import GoldDivider from '@/components/ui/GoldDivider';
import AnimatedText from '@/components/ui/AnimatedText';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Calendar } from '@/components/ui/Calendar';
import { bookingSchema, BookingFormData } from '@/lib/schemas/booking';
import { useBookingStore } from '@/lib/store/useBookingStore';
import { VENUES } from '@/lib/constants/venues';
import { PACKAGES } from '@/lib/constants/packages';
import { submitBooking } from '@/app/actions';
import { Loader2, ArrowLeft, ArrowRight, CheckCircle2, Check, Sparkles } from 'lucide-react';
import Image from 'next/image';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const EVENT_TYPES = [
  { value: 'wedding', label: 'Royal Wedding Reception' },
  { value: 'ceremony', label: 'Traditional Ceremony' },
  { value: 'gala', label: 'Corporate Gala or Banquet' },
  { value: 'soiree', label: 'Intimate Cocktail Soiree' },
  { value: 'anniversary', label: 'Milestone Anniversary' },
  { value: 'other', label: 'Custom Luxury Celebration' },
];

export default function PackagesPageClient() {
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const { formData, currentStep, setStep, nextStep, prevStep, updateField, resetStore } = useBookingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  
  const headerRef = useRef<HTMLDivElement>(null);

  // 1. Setup React Hook Form
  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    setError,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      eventType: formData.eventType || '',
      guestCount: formData.guestCount || 50,
      dateFlexibility: formData.dateFlexibility || 'fixed',
      venueId: formData.venueId || '',
      date: formData.date || '',
      name: formData.name || '',
      email: formData.email || '',
      phone: formData.phone || '',
      notes: formData.notes || '',
    },
    mode: 'onTouched',
  });

  // Watch fields to update the Zustand store in real-time
  const watchedValues = watch();

  useEffect(() => {
    // Sync React Hook Form watched values to Zustand store for the sticky summary card
    Object.entries(watchedValues).forEach(([key, val]) => {
      if (val !== undefined && formData[key as keyof BookingFormData] !== val) {
        updateField(key as keyof BookingFormData, val);
      }
    });
  }, [watchedValues, updateField, formData]);

  // Handle step progression with validation
  const handleNext = async () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = await trigger(['eventType', 'guestCount', 'dateFlexibility']);
    } else if (currentStep === 2) {
      isValid = await trigger(['venueId', 'date']);
    }

    if (isValid) {
      nextStep();
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Handle Form Submission
  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      const packageObj = PACKAGES.find((p) => p.id === selectedPackageId);
      const finalData = {
        ...data,
        notes: packageObj
          ? `[Package Selected: ${packageObj.name} (${packageObj.price})]\n\n${data.notes || ''}`
          : data.notes,
      };

      const result = await submitBooking(finalData);

      if (!result.success && result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof BookingFormData, {
            type: 'server',
            message: message,
          });
        });
        
        if (result.fieldErrors.eventType || result.fieldErrors.guestCount || result.fieldErrors.dateFlexibility) {
          setStep(1);
        } else if (result.fieldErrors.venueId || result.fieldErrors.date) {
          setStep(2);
        } else {
          setStep(3);
        }
      } else if (result.success && result.referenceNumber) {
        setRefNumber(result.referenceNumber);
        setSubmitSuccess(true);
        resetStore();
        window.scrollTo({ top: 120, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Find Selected Venue details for Summary Card
  const selectedVenue = VENUES.find((v) => v.id === watchedValues.venueId);

  // Find Selected Package details
  const selectedPackage = PACKAGES.find((p) => p.id === selectedPackageId);

  // Format Date for Summary Card
  const formatSummaryDate = (dateStr: string) => {
    if (!dateStr) return 'Not Selected';
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) return dateStr;
    return parsed.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Smooth scroll to top when package is selected
  const handleSelectPackage = (packageId: string) => {
    setSelectedPackageId(packageId);
    setStep(1);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <main className="flex-1 bg-obsidian py-12 md:py-20" aria-labelledby="packages-title">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Dynamic Page Header */}
        <AnimatePresence mode="wait">
          {!selectedPackageId ? (
            <motion.div
              key="catalog-header"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16"
              ref={headerRef}
            >
              <span className="font-display text-3xl md:text-4xl text-gold italic leading-none mb-2">
                Tailored For You
              </span>
              
              <AnimatedText
                text="Bespoke Tiers"
                tag="h1"
                className="font-serif text-4xl md:text-6xl text-champagne font-medium tracking-wide mb-4"
              />

              <p className="font-sans text-xs sm:text-sm text-champagne/60 leading-relaxed tracking-widest uppercase">
                Exclusive pricing tiers designed for extraordinary milestones.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="booking-header"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12"
            >
              <span className="font-display text-2xl md:text-3xl text-gold italic leading-none mb-2 flex items-center gap-2">
                <Sparkles size={18} className="text-gold animate-pulse" /> Exclusive Booking
              </span>
              
              <h1 className="font-serif text-3xl sm:text-5xl text-champagne font-medium tracking-wide mb-4 uppercase">
                Reserve {selectedPackage?.name}
              </h1>

              <p className="font-sans text-xs text-champagne/60 leading-relaxed tracking-wider uppercase max-w-lg">
                Complete the details below to reserve your custom package experience.
              </p>

              <button 
                onClick={() => setSelectedPackageId(null)}
                className="mt-6 flex items-center gap-2 text-xs uppercase tracking-widest text-gold hover:text-palegold transition-colors cursor-pointer font-sans py-2 px-4 border border-gold/20 hover:border-gold/40 bg-walnut/5 transition-all duration-300"
              >
                <ArrowLeft size={12} />
                Back to Packages Tiers
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Body: Catalog vs Booking Form */}
        <AnimatePresence mode="wait">
          {!selectedPackageId ? (
            <motion.div
              key="catalog-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Pricing Grid */}
              <PackagesGrid onBookNow={handleSelectPackage} />

              {/* Gold Dividers between cards on mobile (hidden on desktop) */}
              <div className="md:hidden mt-12 space-y-12">
                <GoldDivider />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="booking-form-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
            >
              
              {/* Left Column: Form Panel */}
              <div className="lg:col-span-8 border border-walnut/30 bg-slate p-6 md:p-10 relative">
                
                {/* Submission Success View */}
                {submitSuccess ? (
                  <div className="text-center py-12 space-y-6 flex flex-col items-center">
                    <div className="w-16 h-16 text-gold mb-2 flex items-center justify-center bg-walnut/10 border border-gold/40">
                      <CheckCircle2 size={40} strokeWidth={1} />
                    </div>
                    <h2 className="font-serif text-2xl md:text-3xl text-gold font-medium tracking-wide">
                      Booking Confirmed
                    </h2>
                    <p className="font-sans text-sm text-champagne/70 leading-relaxed max-w-md">
                      Thank you. Your request for the **{selectedPackage?.name}** package has been successfully registered. An Event Concierge will contact you within 24 hours to schedule your private tour and finalize details.
                    </p>
                    
                    <div className="bg-obsidian/50 p-4 border border-walnut/40 max-w-xs w-full text-center">
                      <p className="text-[10px] uppercase tracking-widest text-champagne/40 mb-1">Reference Number</p>
                      <p className="font-serif text-lg text-gold font-bold tracking-wider">{refNumber}</p>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          setSubmitSuccess(false);
                          setSelectedPackageId(null);
                        }}
                        className="btn-ghost-sweep px-6 py-3 text-xs tracking-widest mt-4"
                      >
                        <span>Back to Packages</span>
                        <span className="btn-ghost-sweep-overlay">Back to Packages</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    
                    {/* Step Indicator */}
                    <div className="flex items-center justify-center mb-8 relative px-4" aria-label="Booking steps">
                      <div className="absolute left-0 right-0 h-[1px] bg-walnut/20 top-1/2 -translate-y-1/2 z-0" />
                      
                      <div className="flex justify-between w-full max-w-sm relative z-10">
                        {[1, 2, 3].map((stepNum) => {
                          const isCompleted = stepNum < currentStep;
                          const isActive = stepNum === currentStep;
                          return (
                            <button
                              key={stepNum}
                              type="button"
                              onClick={() => stepNum <= currentStep && setStep(stepNum)}
                              disabled={stepNum > currentStep}
                              className={`w-8 h-8 rounded-full flex items-center justify-center border text-xs font-medium font-sans transition-all duration-300 ${
                                isCompleted || isActive
                                  ? 'bg-gold border-gold text-obsidian font-bold cursor-pointer'
                                  : 'bg-obsidian border-walnut/40 text-champagne/40 cursor-not-allowed'
                              }`}
                              aria-label={`Step ${stepNum}`}
                            >
                              {stepNum}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Form Step Body */}
                    <div className="min-h-[300px]">
                      <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                          <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                          >
                            <h2 className="font-serif text-lg text-gold font-medium tracking-wide border-b border-walnut/20 pb-2">
                              Step 1 — Event Details
                            </h2>

                            {/* Event Type */}
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-champagne/70 font-sans font-medium">
                                Event Type
                              </label>
                              <Select
                                {...register('eventType')}
                                options={EVENT_TYPES}
                                placeholder="Select the type of celebration"
                                error={errors.eventType?.message}
                              />
                            </div>

                            {/* Guest Count */}
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-champagne/70 font-sans font-medium">
                                Estimated Guest Count
                              </label>
                              <Input
                                type="number"
                                {...register('guestCount', { valueAsNumber: true })}
                                placeholder="Minimum 10 - Maximum 2000"
                                error={errors.guestCount?.message}
                              />
                            </div>

                            {/* Date Flexibility */}
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-champagne/70 font-sans font-medium">
                                Date Flexibility
                              </label>
                              <Controller
                                name="dateFlexibility"
                                control={control}
                                render={({ field }) => (
                                  <RadioGroup
                                    name="dateFlexibility"
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={[
                                      { value: 'fixed', label: 'Fixed Date', description: 'I have a specific calendar date in mind.' },
                                      { value: 'flexible', label: 'Flexible Date', description: 'I am open to options within a month/season.' },
                                    ]}
                                    error={errors.dateFlexibility?.message}
                                  />
                                )}
                              />
                            </div>
                          </motion.div>
                        )}

                        {currentStep === 2 && (
                          <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                          >
                            <h2 className="font-serif text-lg text-gold font-medium tracking-wide border-b border-walnut/20 pb-2">
                              Step 2 — Venue & Date
                            </h2>

                            {/* Venue Picker */}
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-champagne/70 font-sans font-medium">
                                Select Celebration Space
                              </label>
                              <Select
                                {...register('venueId')}
                                options={VENUES.map((v) => ({ value: v.id, label: v.name }))}
                                placeholder="Choose your preferred space"
                                error={errors.venueId?.message}
                              />
                            </div>

                            {/* Date Calendar Picker */}
                            <div className="space-y-3">
                              <label className="text-xs uppercase tracking-widest text-champagne/70 font-sans font-medium">
                                Preferred Date
                              </label>
                              <Controller
                                name="date"
                                control={control}
                                render={({ field }) => (
                                  <Calendar
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.date?.message}
                                  />
                                )}
                              />
                            </div>
                          </motion.div>
                        )}

                        {currentStep === 3 && (
                          <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                          >
                            <h2 className="font-serif text-lg text-gold font-medium tracking-wide border-b border-walnut/20 pb-2">
                              Step 3 — Contact Information
                            </h2>

                            {/* Name */}
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-champagne/70 font-sans font-medium">
                                Your Name
                              </label>
                              <Input
                                type="text"
                                {...register('name')}
                                placeholder="Enter your full name"
                                error={errors.name?.message}
                              />
                            </div>

                            {/* Email & Phone grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-champagne/70 font-sans font-medium">
                                  Email Address
                                </label>
                                <Input
                                  type="email"
                                  {...register('email')}
                                  placeholder="name@example.com"
                                  error={errors.email?.message}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-champagne/70 font-sans font-medium">
                                  Phone Number
                                </label>
                                <Input
                                  type="tel"
                                  {...register('phone')}
                                  placeholder="+919876543210"
                                  error={errors.phone?.message}
                                />
                              </div>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-widest text-champagne/70 font-sans font-medium">
                                Bespoke Requests & Notes (Optional)
                              </label>
                              <textarea
                                {...register('notes')}
                                rows={4}
                                placeholder="Detail any customized themes, culinary needs, or scheduling details..."
                                className="flex w-full rounded-none border border-walnut/40 bg-walnut/20 px-3 py-2 text-sm text-champagne placeholder:text-champagne/30 focus-visible:outline-none focus-visible:border-gold focus-visible:ring-1 focus-visible:ring-gold/45 focus-visible:shadow-[0_0_12px_rgba(212,175,55,0.25)] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between border-t border-walnut/20 pt-6">
                      {currentStep > 1 ? (
                        <button
                          type="button"
                          onClick={prevStep}
                          className="flex items-center gap-2 text-xs uppercase tracking-widest text-champagne/60 hover:text-gold transition-colors font-sans py-2 px-4 focus:outline-none cursor-pointer"
                        >
                          <ArrowLeft size={14} />
                          Back
                        </button>
                      ) : (
                        <div />
                      )}

                      {currentStep < 3 ? (
                        <button
                          type="button"
                          onClick={handleNext}
                          className="btn-ghost-sweep px-5 py-2.5 text-xs tracking-widest flex items-center gap-2 group/btn cursor-pointer"
                        >
                          <span>Next Step</span>
                          <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                          <span className="btn-ghost-sweep-overlay">Next Step</span>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-gold text-obsidian hover:bg-palegold py-3 px-8 text-xs tracking-widest font-sans uppercase font-bold transition-all flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 size={14} className="animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            'Confirm Consultation'
                          )}
                        </button>
                      )}
                    </div>

                  </form>
                )}

              </div>

              {/* Right Column: Sticky Summary Card */}
              <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
                
                {/* 1. Selected Package Summary Block */}
                <div className="border border-gold/40 bg-walnut/10 p-6 space-y-4">
                  <h2 className="font-serif text-lg text-gold font-medium tracking-wide border-b border-walnut/20 pb-3 flex items-center justify-between">
                    <span>Selected Tier</span>
                    <span className="text-[11px] uppercase tracking-widest text-champagne/60 font-sans">
                      Package Details
                    </span>
                  </h2>
                  
                  <div>
                    <h3 className="font-serif text-xl text-champagne font-medium">
                      {selectedPackage?.name}
                    </h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-serif text-gold font-medium">{selectedPackage?.price}</span>
                      <span className="text-[9px] text-champagne/40 uppercase tracking-widest font-sans">starting price</span>
                    </div>
                  </div>

                  <p className="font-sans text-[11px] text-champagne/70 leading-relaxed italic">
                    "{selectedPackage?.tagline}"
                  </p>

                  <div className="border-t border-walnut/20 pt-4">
                    <h4 className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold mb-2">
                      Tier Highlights Included:
                    </h4>
                    <ul className="space-y-2 font-sans text-[10px] text-champagne/60">
                      {selectedPackage?.features.slice(0, 4).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check size={10} className="text-gold mt-0.5 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                      {(selectedPackage?.features.length ?? 0) > 4 && (
                        <li className="text-gold italic text-[9px] pt-1">
                          + {(selectedPackage?.features.length ?? 0) - 4} more premium highlights included
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* 2. Venue & Scheduling Summary Block */}
                <div className="border border-walnut/20 bg-slate p-6 space-y-4">
                  <h2 className="font-serif text-base text-champagne font-medium tracking-wide border-b border-walnut/20 pb-3">
                    Your Venue & Schedule
                  </h2>

                  <div className="space-y-3">
                    {selectedVenue ? (
                      <div className="space-y-3">
                        <div className="relative aspect-[16/9] w-full border border-walnut/20 overflow-hidden font-sans">
                          <Image
                            src={selectedVenue.image}
                            alt={selectedVenue.name}
                            fill
                            className="object-cover animate-fadeIn"
                            sizes="(max-width: 768px) 100vw, 25vw"
                          />
                        </div>
                        <p className="font-serif text-sm text-gold font-medium">
                          {selectedVenue.name}
                        </p>
                        <p className="font-sans text-[10px] text-champagne/50 uppercase tracking-widest">
                          {selectedVenue.indoorOutdoor} Setting · {selectedVenue.sqm} sqm
                        </p>
                      </div>
                    ) : (
                      <div className="py-6 border border-dashed border-walnut/20 text-center text-[11px] text-champagne/40 font-sans">
                        No Venue Selected Yet
                      </div>
                    )}
                  </div>

                  <div className="border-t border-walnut/20 pt-4 space-y-3 font-sans text-xs">
                    <div className="flex justify-between py-1">
                      <span className="text-champagne/50">Event Type:</span>
                      <span className="text-gold font-medium text-right max-w-[150px] truncate">
                        {EVENT_TYPES.find(t => t.value === watchedValues.eventType)?.label || 'Not Selected'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-champagne/50">Estimated Guests:</span>
                      <span className="text-gold font-medium">{watchedValues.guestCount || 'Not Set'} guests</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-champagne/50">Date Flexibility:</span>
                      <span className="text-gold font-medium capitalize">{watchedValues.dateFlexibility}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-champagne/50">Scheduled Date:</span>
                      <span className="text-gold font-medium text-right">
                        {formatSummaryDate(watchedValues.date)}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}

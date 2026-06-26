'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import GoldDivider from '@/components/ui/GoldDivider';
import AnimatedText from '@/components/ui/AnimatedText';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Calendar } from '@/components/ui/Calendar';
import { bookingSchema, BookingFormData } from '@/lib/schemas/booking';
import { useBookingStore } from '@/lib/store/useBookingStore';
import { VENUES } from '@/lib/constants/venues';
import { submitBooking } from '@/app/actions';
import { Mail, Phone, MapPin, Loader2, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const EVENT_TYPES = [
  { value: 'wedding', label: 'Royal Wedding Reception' },
  { value: 'ceremony', label: 'Traditional Ceremony' },
  { value: 'gala', label: 'Corporate Gala or Banquet' },
  { value: 'soiree', label: 'Intimate Cocktail Soiree' },
  { value: 'anniversary', label: 'Milestone Anniversary' },
  { value: 'other', label: 'Custom Luxury Celebration' },
];

export default function ContactPage() {
  const { formData, currentStep, setStep, nextStep, prevStep, updateField, resetStore } = useBookingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [refNumber, setRefNumber] = useState('');

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

  // Pre-fill check in case we arrived with a selected venue from Venues Page
  useEffect(() => {
    if (formData.venueId) {
      // Ensure the store is in sync
      updateField('venueId', formData.venueId);
    }
  }, [formData.venueId, updateField]);

  // 2. Handle Step Progression with validation
  const handleNext = async () => {
    let isValid = false;

    if (currentStep === 1) {
      // Validate Step 1 fields
      isValid = await trigger(['eventType', 'guestCount', 'dateFlexibility']);
    } else if (currentStep === 2) {
      // Validate Step 2 fields
      isValid = await trigger(['venueId', 'date']);
    }

    if (isValid) {
      nextStep();
    }
  };

  // 3. Handle Form Submission
  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      const result = await submitBooking(data);

      if (!result.success && result.fieldErrors) {
        // Map server-side validation errors back to React Hook Form fields
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof BookingFormData, {
            type: 'server',
            message: message,
          });
        });
        
        // Go back to the step that has the error
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
      }
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Find Selected Venue details for Summary Card
  const selectedVenue = VENUES.find((v) => v.id === watchedValues.venueId);

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

  return (
    <>
      <Navbar />
      
      {/* Spacer */}
      <div className="h-24 md:h-32 bg-obsidian" />

      <main className="flex-1 bg-obsidian py-12 md:py-20" aria-labelledby="contact-title">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
            <span className="font-display text-3xl md:text-4xl text-gold italic leading-none mb-2">
              Plan Your Celebration
            </span>
            
            <AnimatedText
              text="Book a Tour & Enquire"
              tag="h1"
              className="font-serif text-4xl md:text-6xl text-champagne font-medium tracking-wide mb-4"
            />

            <p className="font-sans text-xs sm:text-sm text-champagne/60 leading-relaxed tracking-widest uppercase">
              Begin your era of luxury with us. Complete the details below.
            </p>
          </div>

          {/* Two Column Layout: Form Panel + Sticky Summary Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Form Panel (Step managed) */}
            <div className="lg:col-span-8 border border-walnut/30 bg-slate p-6 md:p-10 relative">
              
              {/* Submission Success View */}
              {submitSuccess ? (
                <div className="text-center py-12 space-y-6 flex flex-col items-center">
                  <div className="w-16 h-16 text-gold mb-2 flex items-center justify-center bg-walnut/10 border border-gold/40">
                    <CheckCircle2 size={40} strokeWidth={1} />
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl text-gold font-medium tracking-wide">
                    Request Confirmed
                  </h2>
                  <p className="font-sans text-sm text-champagne/70 leading-relaxed max-w-md">
                    Thank you. Your consultation request has been successfully registered. A dedicated Event Concierge will contact you within 24 hours to schedule your private tour.
                  </p>
                  
                  <div className="bg-obsidian/50 p-4 border border-walnut/40 max-w-xs w-full text-center">
                    <p className="text-[10px] uppercase tracking-widest text-champagne/40 mb-1">Reference Number</p>
                    <p className="font-serif text-lg text-gold font-bold tracking-wider">{refNumber}</p>
                  </div>

                  <button
                    onClick={() => {
                      setSubmitSuccess(false);
                      setStep(1);
                    }}
                    className="btn-ghost-sweep px-6 py-3 text-xs tracking-widest mt-4"
                  >
                    <span>Submit Another Enquiry</span>
                    <span className="btn-ghost-sweep-overlay">Submit Another Enquiry</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  
                  {/* Step Indicator */}
                  <div className="flex items-center justify-center mb-8 relative px-4" aria-label="Booking steps">
                    {/* Background Connecting Line */}
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
                                ? 'bg-gold border-gold text-obsidian font-bold'
                                : 'bg-obsidian border-walnut/40 text-champagne/40'
                            }`}
                            aria-label={`Step ${stepNum}`}
                          >
                            {stepNum}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Form Step Body (Framer Motion slide+fade inside the panel) */}
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
                        className="flex items-center gap-2 text-xs uppercase tracking-widest text-champagne/60 hover:text-gold transition-colors font-sans py-2 px-4 focus:outline-none"
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
                        className="btn-ghost-sweep px-5 py-2.5 text-xs tracking-widest flex items-center gap-2 group/btn"
                      >
                        <span>Next Step</span>
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                        <span className="btn-ghost-sweep-overlay">Next Step</span>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gold text-obsidian hover:bg-palegold py-3 px-8 text-xs tracking-widest font-sans uppercase font-bold transition-all flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
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
            <div className="lg:col-span-4 lg:sticky lg:top-28">
              <div className="border border-gold/30 bg-walnut/15 p-6 space-y-6">
                <h2 className="font-serif text-lg text-gold font-medium tracking-wide border-b border-walnut/25 pb-3">
                  Your Celebration Summary
                </h2>

                {/* Selected Venue Details (Shows image when selected) */}
                <div className="space-y-3">
                  {selectedVenue ? (
                    <div className="space-y-3">
                      <div className="relative aspect-[16/9] w-full border border-walnut/20 overflow-hidden font-sans">
                        <Image
                          src={selectedVenue.image}
                          alt={selectedVenue.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 25vw"
                        />
                      </div>
                      <p className="font-serif text-sm text-champagne font-medium">
                        {selectedVenue.name}
                      </p>
                      <p className="font-sans text-[10px] text-champagne/50 uppercase tracking-widest">
                        {selectedVenue.indoorOutdoor} Setting · {selectedVenue.sqm} sqm
                      </p>
                    </div>
                  ) : (
                    <div className="py-6 border border-dashed border-walnut/20 text-center text-xs text-champagne/40 font-sans">
                      No Venue Selected Yet
                    </div>
                  )}
                </div>

                {/* Parameter summary grid */}
                <div className="border-t border-walnut/20 pt-4 space-y-3 font-sans text-xs">
                  <div className="flex justify-between py-1">
                    <span className="text-champagne/50">Event Type:</span>
                    <span className="text-gold font-medium text-right max-w-[160px] truncate">
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

                {/* Accent design rule */}
                <div className="border-t border-walnut/20 pt-4">
                  <p className="text-[10px] text-champagne/40 italic font-sans leading-relaxed text-center">
                    Choices will accumulate as you progress through the form. We review each enquiry personally.
                  </p>
                </div>
              </div>
            </div>

          </div>

          <GoldDivider className="my-16" />

          {/* Contact Details & Google Maps Embed */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch mb-8">
            
            {/* Contact details blocks */}
            <div className="md:col-span-4 flex flex-col justify-between gap-6">
              
              {/* Address block */}
              <div className="flex items-start gap-4 p-5 border border-walnut/20 bg-walnut/5">
                <div className="text-gold mt-1">
                  <MapPin size={20} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <div className="font-sans">
                  <h3 className="text-xs uppercase tracking-widest text-gold font-bold mb-1">Estate Location</h3>
                  <p className="text-xs text-champagne/70 leading-relaxed">
                    Grandeur Hall Estate, Wardha Road,<br />Nagpur, Maharashtra 440015, India
                  </p>
                </div>
              </div>

              {/* Phone block */}
              <div className="flex items-start gap-4 p-5 border border-walnut/20 bg-walnut/5">
                <div className="text-gold mt-1">
                  <Phone size={20} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <div className="font-sans">
                  <h3 className="text-xs uppercase tracking-widest text-gold font-bold mb-1">Phone Enquiries</h3>
                  <p className="text-xs text-champagne/70 leading-relaxed">
                    +91 98765 43210 <br />
                    +91 98765 99999
                  </p>
                </div>
              </div>

              {/* Email block */}
              <div className="flex items-start gap-4 p-5 border border-walnut/20 bg-walnut/5 font-sans">
                <div className="text-gold mt-1">
                  <Mail size={20} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-gold font-bold mb-1">Electronic Mail</h3>
                  <p className="text-xs text-champagne/70 leading-relaxed">
                    hello@grandeurhall.com <br />
                    concierge@grandeurhall.com
                  </p>
                </div>
              </div>

            </div>

            {/* Google Map Embed (Dark Palette Filtered) */}
            <div className="md:col-span-8 relative border border-walnut/20 min-h-[320px] overflow-hidden">
              <iframe
                title="Grandeur Hall Estate Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119066.41702161744!2d79.0024694939223!3d21.149354060862024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0a113d78351%3A0x959728cf0a1c6a28!2sNagpur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1719323562381!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  // CSS filter trick to convert standard maps into an awesome dark theme!
                  filter: 'invert(90%) hue-rotate(180deg) grayscale(100%) contrast(90%)',
                }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

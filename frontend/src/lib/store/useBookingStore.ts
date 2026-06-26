import { create } from 'zustand';
import { BookingFormData } from '../schemas/booking';

interface BookingState {
  currentStep: number;
  formData: Partial<BookingFormData>;
  errors: Record<string, string>;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateField: <K extends keyof BookingFormData>(field: K, value: BookingFormData[K]) => void;
  setErrors: (errors: Record<string, string>) => void;
  resetStore: () => void;
}

const initialFormData: Partial<BookingFormData> = {
  eventType: '',
  guestCount: 50,
  dateFlexibility: 'fixed',
  venueId: '',
  date: '',
  name: '',
  email: '',
  phone: '',
  notes: '',
};

export const useBookingStore = create<BookingState>((set) => ({
  currentStep: 1,
  formData: initialFormData,
  errors: {},
  
  setStep: (step) => set({ currentStep: step }),
  
  nextStep: () => set((state) => ({ 
    currentStep: Math.min(state.currentStep + 1, 3) 
  })),
  
  prevStep: () => set((state) => ({ 
    currentStep: Math.max(state.currentStep - 1, 1) 
  })),
  
  updateField: (field, value) => set((state) => {
    // Clear the error for this field when updated
    const newErrors = { ...state.errors };
    delete newErrors[field];
    
    return {
      formData: {
        ...state.formData,
        [field]: value,
      },
      errors: newErrors,
    };
  }),
  
  setErrors: (errors) => set({ errors }),
  
  resetStore: () => set({
    currentStep: 1,
    formData: initialFormData,
    errors: {},
  }),
}));

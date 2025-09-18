import { File } from 'buffer';

export interface RegistrationProps {
  onBack: () => void;
  onSuccess: () => void;
}

export interface RegistrationFormData {
  ensName: string;
  displayName: string;
}

export type RegistrationStep = 'form' | 'uploading' | 'registering' | 'success';

export interface RegistrationState {
  formData: RegistrationFormData;
  profileImage: File | null;
  imagePreview: string | null;
  isCheckingAvailability: boolean;
  ensAvailable: boolean | null;
  registrationStep: RegistrationStep;
}

export interface RegistrationFormProps {
  formData: RegistrationFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckAvailability: () => Promise<void>;
  isCheckingAvailability: boolean;
  ensAvailable: boolean | null;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  imagePreview: string | null;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  onBack: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export interface RegistrationStatusProps {
  status: RegistrationStep;
  ensName: string;
  onBack: () => void;
  onContinue: () => void;
}

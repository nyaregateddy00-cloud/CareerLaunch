import { useContext } from 'react';
import { ToastContext, ToastContextType } from '../context/ToastContext';

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}


import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = useCallback(({ message, type, duration = 3000 }: ToastProps) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { message, type, duration }]);
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.message !== message));
    }, duration);
  }, []);

  return { toasts, showToast };
};
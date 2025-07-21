import { useMemo } from 'react';
import toast from 'react-hot-toast';

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export interface ToastContextType {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  toasts: Toast[];
}

// Custom toast helper functions
export const useToastHelpers = () => {
  return useMemo(() => ({
    success: (title: string, message?: string) => {
      const content = message ? `${title}: ${message}` : title;
      toast.success(content, {
        duration: 3000,
        style: {
          background: '#10b981',
          color: '#fff',
          fontWeight: '500',
        },
      });
    },

    error: (title: string, message?: string) => {
      const content = message ? `${title}: ${message}` : title;
      toast.error(content, {
        duration: 4000,
        style: {
          background: '#ef4444',
          color: '#fff',
          fontWeight: '500',
        },
      });
    },

    warning: (title: string, message?: string) => {
      const content = message ? `${title}: ${message}` : title;
      toast(content, {
        icon: '⚠️',
        duration: 4000,
        style: {
          background: '#f59e0b',
          color: '#fff',
          fontWeight: '500',
        },
      });
    },

    info: (title: string, message?: string) => {
      const content = message ? `${title}: ${message}` : title;
      toast(content, {
        icon: 'ℹ️',
        duration: 3000,
        style: {
          background: '#3b82f6',
          color: '#fff',
          fontWeight: '500',
        },
      });
    },

    loading: (message: string) => {
      return toast.loading(message, {
        style: {
          background: '#6b7280',
          color: '#fff',
          fontWeight: '500',
        },
      });
    },

    dismiss: (toastId?: string) => {
      toast.dismiss(toastId);
    },

    promise: <T>(
      promise: Promise<T>,
      msgs: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: any) => string);
      }
    ) => {
      return toast.promise(promise, msgs, {
        style: {
          fontWeight: '500',
        },
        success: {
          style: {
            background: '#10b981',
            color: '#fff',
          },
        },
        error: {
          style: {
            background: '#ef4444',
            color: '#fff',
          },
        },
        loading: {
          style: {
            background: '#6b7280',
            color: '#fff',
          },
        },
      });
    },
  }), []);
};

// Re-export toast for direct usage
export { toast };
export default toast;

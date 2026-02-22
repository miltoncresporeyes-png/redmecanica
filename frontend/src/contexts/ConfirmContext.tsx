import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'primary' | 'secondary';
  icon?: 'warning' | 'info' | 'delete';
}

interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
  resolve: ((value: boolean) => void) | null;
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  close: () => void;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    confirmVariant: 'primary',
    icon: 'info',
    resolve: null
  });

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        ...options,
        isOpen: true,
        resolve
      });
    });
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false
    }));
    // Resolve with false after animation
    setTimeout(() => {
      state.resolve?.(false);
      setState((prev) => ({ ...prev, resolve: null }));
    }, 200);
  }, [state.resolve]);

  const handleConfirm = useCallback(() => {
    state.resolve?.(true);
    setState((prev) => ({
      ...prev,
      isOpen: false,
      resolve: null
    }));
  }, [state.resolve]);

  const handleCancel = useCallback(() => {
    state.resolve?.(false);
    setState((prev) => ({
      ...prev,
      isOpen: false,
      resolve: null
    }));
  }, [state.resolve]);

  const getIcon = () => {
    switch (state.icon) {
      case 'warning':
        return (
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'delete':
        return (
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getConfirmButtonStyles = () => {
    switch (state.confirmVariant) {
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
      case 'secondary':
        return 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm, close }}>
      {children}
      
      {state.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-in fade-in"
            onClick={handleCancel}
          />
          
          {/* Dialog */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div 
              className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 fade-in"
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
            >
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className="mb-4">
                  {getIcon()}
                </div>
                
                {/* Title */}
                <h3 
                  id="confirm-title"
                  className="text-xl font-bold text-gray-900 mb-2"
                >
                  {state.title}
                </h3>
                
                {/* Message */}
                <p className="text-gray-600 mb-6">
                  {state.message}
                </p>
                
                {/* Buttons */}
                <div className="flex gap-3 w-full">
                  <button
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    {state.cancelText}
                  </button>
                  
                  <button
                    onClick={handleConfirm}
                    className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${getConfirmButtonStyles()}`}
                    autoFocus
                  >
                    {state.confirmText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context.confirm;
};

// Convenience hook for common confirmations
export const useConfirmLeave = () => {
  const confirm = useConfirm();
  
  return useCallback(async (message?: string) => {
    const result = await confirm({
      title: '¿Salir sin guardar?',
      message: message || 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?',
      confirmText: 'Salir',
      cancelText: 'Quedarme',
      confirmVariant: 'secondary',
      icon: 'warning'
    });
    return result;
  }, [confirm]);
};

export const useConfirmDelete = () => {
  const confirm = useConfirm();
  
  return useCallback(async (itemName: string) => {
    const result = await confirm({
      title: '¿Eliminar?',
      message: `¿Estás seguro de que quieres eliminar "${itemName}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      confirmVariant: 'danger',
      icon: 'delete'
    });
    return result;
  }, [confirm]);
};

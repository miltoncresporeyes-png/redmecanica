import React, { useState, useEffect } from 'react';

// Skip to main content link for keyboard navigation
export const SkipToContent: React.FC = () => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                 bg-blue-600 text-white px-4 py-2 rounded-lg z-50 
                 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      Saltar al contenido principal
    </a>
  );
};

// Announce changes to screen readers
export const LiveRegion: React.FC<{ 
  children: React.ReactNode; 
  assertive?: boolean;
  id?: string;
}> = ({ children, assertive = false, id }) => (
  <div
    id={id}
    role="status"
    aria-live={assertive ? 'assertive' : 'polite'}
    aria-atomic="true"
    className="sr-only"
  >
    {children}
  </div>
);

// Focus trap for modals
export const useFocusTrap = (isActive: boolean, containerRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, containerRef]);
};

// Announce to screen readers
export const useAnnounce = () => {
  const [announcement, setAnnouncement] = useState('');

  const announce = (message: string, assertive = false) => {
    setAnnouncement(message);
    // Clear after announcement
    setTimeout(() => setAnnouncement(''), 1000);
  };

  return { announce, announcement };
};

// Focus visible utility
export const FocusVisible: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 rounded-lg">
    {children}
  </div>
);

// Visually hidden text for screen readers
export const VisuallyHidden: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="sr-only">{children}</span>
);

// Accessible button with proper focus states
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  isLoading,
  loadingText = 'Cargando...',
  disabled,
  ...props
}) => (
  <button
    {...props}
    disabled={disabled || isLoading}
    aria-disabled={disabled || isLoading}
    aria-busy={isLoading}
    className={`
      ${props.className || ''}
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `}
  >
    {isLoading ? (
      <>
        <span className="sr-only">{loadingText}</span>
        <span aria-hidden="true">{children}</span>
      </>
    ) : (
      children
    )}
  </button>
);

// Accessible link that works like a button
interface AccessibleLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  onClick?: () => void;
}

export const AccessibleLink: React.FC<AccessibleLinkProps> = ({
  children,
  onClick,
  ...props
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <a
      {...props}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={`
        ${props.className || ''}
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        cursor-pointer
      `}
    >
      {children}
    </a>
  );
};

// Error message with proper ARIA
export const ErrorMessage: React.FC<{ id: string; children: React.ReactNode }> = ({
  id,
  children
}) => (
  <span id={id} role="alert" className="text-red-600 text-sm mt-1">
    {children}
  </span>
);

// Form field with label and error
interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactElement;
  id: string;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  children,
  id,
  required
}) => {
  const errorId = error ? `${id}-error` : undefined;
  
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        {required && <VisuallyHidden>(requerido)</VisuallyHidden>}
      </label>
      {React.cloneElement(children, {
        id,
        'aria-invalid': !!error,
        'aria-describedby': errorId,
        'aria-required': required
      })}
      {error && <ErrorMessage id={errorId!}>{error}</ErrorMessage>}
    </div>
  );
};

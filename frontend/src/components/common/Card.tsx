
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string; // Keep explicit className for compatibility if needed, though HTMLAttributes includes it.
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`} {...props}>
      <div className="p-6 md:p-8">
        {children}
      </div>
    </div>
  );
};

export default Card;

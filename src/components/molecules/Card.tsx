import React from "react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Card component for displaying content in a contained box
 */
export const Card: React.FC<CardProps> = ({
  title,
  children,
  footer,
  className = "",
}) => {
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;

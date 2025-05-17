import React from "react";

interface ICardProps {
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}

/**
 * Card component for displaying content in a box with optional title and footer
 */
export const Card: React.FC<ICardProps> = ({
  title,
  children,
  footer,
  className = "",
  "data-testid": testId = "card",
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
      data-testid={testId}
    >
      {title && (
        <div className="px-6 py-4 border-b" data-testid={`${testId}-header`}>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-6" data-testid={`${testId}-content`}>
        {children}
      </div>
      {footer && (
        <div
          className="px-6 py-4 bg-gray-50 border-t"
          data-testid={`${testId}-footer`}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;

import React from 'react';

interface ErrorMessageProps {
  children: React.ReactNode;
}

export const StyledErrorMessage: React.FC<ErrorMessageProps> = ({ children }) => {
  return (
    <span className="inline-block text-red-500 mb-2 text-sm relative pl-4 before:content-['•'] before:pr-1 before:pl-2 before:absolute before:left-0">
      {children}
    </span>
  );
}; 
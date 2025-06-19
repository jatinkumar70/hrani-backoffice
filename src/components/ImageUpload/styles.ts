import React from 'react';

interface ImageAlbumContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const ImageAlbumContainer: React.FC<ImageAlbumContainerProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`grid grid-cols-1 p-4 mb-4 mt-4 border border-gray-200 rounded-md bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
};
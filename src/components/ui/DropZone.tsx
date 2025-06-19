import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface DropZoneProps {
  title?: string;
  imageSize?: string;
  onChange: (files: File[]) => void;
}

const DropZone: React.FC<DropZoneProps> = ({
  title = "Drop files here or click to browse",
  imageSize,
  onChange,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange(acceptedFiles);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md cursor-pointer transition-colors duration-200 min-h-[120px] 
        ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"}
        ${isDragReject ? "border-red-500 bg-red-50" : ""}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <div className="text-center">
          <p className="text-base text-gray-700 font-medium">{title}</p>
          {imageSize && (
            <span className="text-xs text-gray-500">{imageSize}</span>
          )}
        </div>
        {isDragReject && (
          <p className="text-sm text-red-500">
            Some files are not supported. Please upload only images.
          </p>
        )}
      </div>
    </div>
  );
};

export default DropZone; 
import React from "react";
import { IFileUpload, IFileUploadV2Props } from "./FileUpload.type";
import { useDropzone } from "react-dropzone";
import { MultiFileDisplay } from "./FileUpload";
import { getUniqueId } from "../../helpers/getUniqueId";

export const FileUploadV2: React.FC<IFileUploadV2Props> = (props) => {
  const {
    height,
    value,
    onChange,
    onDelete,
    deleteDisabled = false,
    actionButton,
    multiple,
    onMultiChange,
  } = props;
  const [file, setFile] = React.useState<File | null>(props.file || null);

  const onDrop = (acceptedFiles: File[]) => {
    const files = acceptedFiles;
    if (files && files.length > 0 && !multiple) {
      const file = files[0];
      if (props.onChange) {
        setFile(file);
        props.onChange(file);
      }
    } else if (
      files &&
      files.length > 0 &&
      Array.isArray(value) &&
      multiple
    ) {
      const file = files[0];
      if (onMultiChange) {
        onMultiChange([
          ...value,
          {
            key: getUniqueId(),
            file: file,
            name: file.name,
            path: null,
          },
        ]);
      }
    }
  };

  const handleMultiChange = (data: IFileUpload[]) => {
    if (onMultiChange) {
      onMultiChange(data);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDelete = () => {
    if (onDelete) {
      setFile(null);
      onDelete();
    }
  };

  const containerStyle = {
    minHeight: height || "300px"
  };

  if ((value || file) && multiple && !Array.isArray(value)) {
    return (
      <div className="shadow rounded">
        <div
          className="flex flex-col justify-center items-center p-4 space-y-4 border-2 border-dashed border-gray-400"
          style={containerStyle}
        >
          <div className="flex flex-col items-center justify-center space-y-2 w-4/5">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div className="absolute -top-1 right-0 p-0.5 bg-green-500 rounded-full flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <p className="text-base font-semibold text-gray-600">
              {value || file?.name}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition duration-150"
              onClick={handleDelete}
            >
              Remove
            </button>
            {actionButton && (
              <button
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-150"
                onClick={actionButton.onClick}
              >
                {actionButton.text}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        {...getRootProps()}
        className={`flex flex-col justify-center items-center space-y-4 border-2 border-dashed ${isDragActive ? "border-blue-500" : "border-gray-400"}`}
        style={containerStyle}
      >
        <input {...getInputProps()} />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-20 w-20 text-gray-400"
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
        <p className="text-base font-semibold text-gray-600">
          Drop documents here to get signed
        </p>

        <label htmlFor="file-upload">
          <button
            className={`px-4 py-2 text-lg font-semibold rounded flex items-center 
              ${isDragActive
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black hover:bg-gray-400"}`}
          >
            Upload
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </label>
      </div>
      {multiple && Array.isArray(value) && (
        <MultiFileDisplay value={value} deleteDisabled={deleteDisabled} onChange={handleMultiChange} />
      )}
    </>
  );
};

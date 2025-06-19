import React from "react";
import { useDropzone } from "react-dropzone";
import { IFileUpload, IFileUploadProps } from "./FileUpload.type";
import { produce } from "immer";
import { downLoadFile, getFileNameFromUrl, previewFile } from "./utils";
import { getUniqueId } from "@/helpers/getUniqueId";

export const FileUpload: React.FC<IFileUploadProps> = (props) => {
  const {
    heading = "",
    value,
    multiple = false,
    disabled = false,
    deleteDisabled,
    onMultiChange,
  } = props;

  const [localFile, setLocalFile] = React.useState<File | null>(null);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const files = acceptedFiles;
      if (files && files.length > 0 && !multiple) {
        const file = files[0];
        if (props.onChange) {
          setLocalFile(file);
          props.onChange(file);
        }
      } else if (
        files &&
        files.length > 0 &&
        Array.isArray(value) &&
        multiple
      ) {
        const file = files[0];
        if (props.onMultiChange) {
          props.onMultiChange([
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
    },
    [value]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDelete = () => {
    setLocalFile(null);
    if (props.onDelete) {
      props.onDelete();
    }
  };

  const handleMultiChange = (data: IFileUpload[]) => {
    if (onMultiChange) {
      onMultiChange(data);
    }
  };

  if (!multiple && !Array.isArray(value)) {
    return (
      <div className="w-full">
        <h3 className="font-semibold">{heading}</h3>

        {!localFile && !value && (
          <div
            {...getRootProps()}
            className={`mt-1 p-2 flex flex-row justify-center rounded min-h-[50px] ${isDragActive
              ? "border-2 border-dashed border-primary"
              : "border-2 border-dashed border-gray-500"
              } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-auto"}`}
          >
            <input {...getInputProps()} />

            <div
              className={`flex flex-row justify-center items-center gap-1 cursor-pointer ${isDragActive ? "text-primary" : "text-gray-900"
                }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <h5 className="text-xl font-bold">Browse Files</h5>
            </div>
          </div>
        )}
        {(localFile || value) && (
          <div className="mt-1">
            <SingleFileDisplay
              file={localFile}
              value={value as string}
              onDelete={handleDelete}
              deleteDisabled={deleteDisabled}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="font-semibold">{heading}</h3>

      <div
        {...getRootProps()}
        className={`mt-1 p-2 flex flex-row justify-center rounded min-h-[50px] ${isDragActive
          ? "border-2 border-dashed border-primary"
          : "border-2 border-dashed border-gray-500"
          } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-auto"}`}
      >
        <input {...getInputProps()} />

        <div
          className={`flex flex-row justify-center items-center gap-1 cursor-pointer ${isDragActive ? "text-primary" : "text-gray-900"
            }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <h5 className="text-xl font-bold">Browse Files</h5>
        </div>
      </div>

      {Array.isArray(value) && (
        <MultiFileDisplay
          value={value}
          onChange={handleMultiChange}
          deleteDisabled={deleteDisabled}
        />
      )}
    </div>
  );
};

export const SingleFileDisplay: React.FC<{
  file?: File | null;
  value: string | null;
  onDelete?: () => void;
  deleteDisabled?: boolean;
}> = (props) => {
  const { file, value, onDelete, deleteDisabled } = props;
  const [loading, setLoading] = React.useState(false);

  const handleDownloadFile = async () => {
    if (file) {
      const downloadLink = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = downloadLink;
      a.download = file.name || "download";
      a.click();
      URL.revokeObjectURL(downloadLink);
      return;
    }
    if (!loading) {
      try {
        setLoading(true);
        await downLoadFile(props.value);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePreviewFile = async () => {
    if (file) {
      const downloadLink = URL.createObjectURL(file);
      window.open(downloadLink, "_blank");
      return;
    }
    if (!loading) {
      try {
        setLoading(true);
        await previewFile(props.value);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="flex flex-row border border-gray-400 min-h-[70px] rounded overflow-hidden relative">
        <div className="flex flex-row justify-center flex-1 items-center bg-gray-100 border-l-4 border-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <div className="flex flex-2 flex-row bg-white justify-start items-center">
          <div className="pl-2">
            <p className="font-semibold text-base break-all">
              {file ? file.name : value ? getFileNameFromUrl(value) : ""}
            </p>
          </div>
          {loading && (
            <div className="absolute bottom-0 w-full h-1 bg-gray-200">
              <div className="h-full bg-red-500 animate-pulse"></div>
            </div>
          )}
        </div>

        <div className="flex flex-row justify-center flex-1 items-center space-x-2">
          <button
            title="Preview"
            onClick={handlePreviewFile}
            className={`text-gray-600 ${loading ? "opacity-50" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            title="Download"
            onClick={handleDownloadFile}
            className={`text-gray-600 ${loading ? "opacity-50" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            title="Delete"
            onClick={onDelete}
            className={`text-gray-600 ${deleteDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export const MultiFileDisplay: React.FC<{
  value: IFileUpload[];
  onChange: (files: IFileUpload[]) => void;
  deleteDisabled?: boolean;
}> = (props) => {
  const { value, onChange, deleteDisabled } = props;
  const [loading, setLoading] = React.useState<number | null>(null);

  const handleDownloadFile = (row: IFileUpload, index: number) => async () => {
    if (row.file) {
      const downloadLink = URL.createObjectURL(row.file);
      const a = document.createElement("a");
      a.href = downloadLink;
      a.download = row.file.name || "download";
      a.click();
      URL.revokeObjectURL(downloadLink);
      return;
    }

    if (!loading && row.path) {
      try {
        setLoading(index);
        await downLoadFile(row.path);
      } catch (err) {
      } finally {
        setLoading(null);
      }
    }
  };

  const handlePreviewFile = (row: IFileUpload, index: number) => async () => {
    if (row.file) {
      const downloadLink = URL.createObjectURL(row.file);
      window.open(downloadLink, "_blank");
      return;
    }

    if (!loading && row.path) {
      try {
        setLoading(index);
        await previewFile(row.path);
      } catch (err) {
      } finally {
        setLoading(null);
      }
    }
  };

  const handleDelete = (rowIndex: number) => () => {
    if (!deleteDisabled) {
      const newValue = produce(value, (draftValues) => {
        draftValues.splice(rowIndex, 1);
      });
      onChange(newValue);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-1 mt-1">
        {value.map((item, index) => {
          const fileName = item.file
            ? item.file.name
            : item.name || getFileNameFromUrl(item.path || "");
          return (
            <div
              key={index}
              className="flex flex-row border border-gray-400 min-h-[70px] rounded overflow-hidden relative"
            >
              <div className="flex flex-row justify-center flex-1 items-center bg-gray-100 max-w-[17%] border-l-4 border-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <div className="flex flex-2 flex-row bg-white justify-start items-center pl-2">
                <div className="pl-2">
                  <p className="font-semibold text-base break-all">
                    {fileName}
                  </p>
                </div>
                {loading !== null && loading === index && (
                  <div className="absolute bottom-0 w-full h-1 bg-gray-200">
                    <div className="h-full bg-red-500 animate-pulse"></div>
                  </div>
                )}
              </div>

              <div className="flex flex-row justify-center flex-1 items-center space-x-2">
                <button
                  title="Preview"
                  onClick={handlePreviewFile(item, index)}
                  className={`text-gray-600 ${loading !== null && loading === index ? "opacity-50" : ""
                    }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  title="Download"
                  onClick={handleDownloadFile(item, index)}
                  className={`text-gray-600 ${loading !== null && loading === index ? "opacity-50" : ""
                    }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  title="Delete"
                  onClick={handleDelete(index)}
                  className={`text-gray-600 ${deleteDisabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

"use client";

import React, { useState, useEffect } from "react";
import { uploadMultipleFileV2 } from "../FileUpload/utils/uploadMultipleFile";
import DropZone from "../ui/DropZone";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface IImageFileUploaderV2Props {
  files: string[];
  onFilesChange: (data: string[]) => void;
  title?: string;
  asPayload: {
    [key: string]: string | number | null;
  };
  selectedImages: string[];
  onSelectImage: (filePath: string) => void;
}

interface Props {
  id: string;
  file_path: string;
  isSelected: boolean;
  onSelectImage: (filePath: string) => void;
}

const SortableImage = ({
  id,
  file_path,
  isSelected,
  onSelectImage,
}: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: transform ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`relative border-2 ${isSelected ? "border-black" : "border-transparent"
        } rounded-lg overflow-hidden`}
    >
      <div className="w-[150px] h-[130px] flex overflow-hidden rounded-lg relative items-center justify-center bg-blue-50 cursor-grab active:cursor-grabbing hover:shadow-md">
        {/* Checkbox stays outside drag listeners */}
        <div
          className="absolute top-2 left-2 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelectImage(file_path);
            }}
            className="w-4 h-4 accent-blue-600 border-2 border-blue-400 rounded focus:ring-2 focus:ring-blue-400 transition-all shadow"
          />
        </div>

        {/* Image area with drag listeners */}
        <div
          {...listeners}
          className="mt-[50px] cursor-grabbing"
        >
          <img
            alt="product"
            src={`${import.meta.env.VITE_S3_PUBLIC_PREFIX_URL}/${file_path}`}
            className="w-full h-full object-cover select-none"
            onClick={() => onSelectImage(file_path)}
          />
        </div>
      </div>
    </div>
  );
};

// Component to show loading state for uploading files
const LoadingImageBox = ({ file }: { file: File }) => {
  return (
    <div className="w-[150px] h-[130px] flex overflow-hidden rounded-lg relative items-center justify-center bg-blue-50 cursor-default">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      <div className="absolute bottom-0 w-full p-1 bg-black/50 text-white text-xs text-center overflow-hidden text-ellipsis whitespace-nowrap">
        {file.name}
      </div>
    </div>
  );
};

interface FileStatus {
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  path?: string;
}

export const FileUploaderAsyncV2: React.FC<IImageFileUploaderV2Props> = ({
  files,
  onFilesChange,
  title = "",
  asPayload,
  selectedImages,
  onSelectImage,
}) => {
  const [uploadStatus, setUploadStatus] = useState<FileStatus[]>([]);
  const [uploadedPaths, setUploadedPaths] = useState<string[]>([]);

  // Update files when uploads complete
  useEffect(() => {
    if (uploadedPaths.length > 0) {
      onFilesChange([...files, ...uploadedPaths]);
      setUploadedPaths([]);
    }
  }, [uploadedPaths, files, onFilesChange]);

  const handleChangeDropZone = async (data: File[]) => {
    // Initialize status for new files
    const initialStatus = data.map((file) => ({
      file,
      status: "uploading" as const,
    }));

    setUploadStatus((prev) => [...prev, ...initialStatus]);

    try {
      // Upload each file individually to track progress
      data.forEach(async (file) => {
        try {
          const paths = await uploadMultipleFileV2(
            [file],
            "PROPERTY",
            asPayload,
            (updatedFile, status) => {
              //@ts-ignore
              setUploadStatus((prev) =>
                //@ts-ignore
                prev.map((item) =>
                  item.file === updatedFile ? { ...item, status } : item
                )
              );
            }
          );

          if (paths && paths.length > 0) {
            // Mark as success and store the path
            setUploadStatus((prev) =>
              prev.map((item) =>
                item.file === file
                  ? { ...item, status: "success", path: paths[0] }
                  : item
              )
            );

            // Add to uploaded paths
            setUploadedPaths((prev) => [...prev, paths[0]]);
          }
        } catch (err) {
          // Mark individual file as error
          setUploadStatus((prev) =>
            prev.map((item) =>
              item.file === file ? { ...item, status: "error" } : item
            )
          );
        }
      });
    } catch (err) {
      // Fallback error handling
      setUploadStatus((prev) =>
        prev.map((item) =>
          data.includes(item.file) ? { ...item, status: "error" } : item
        )
      );
    }
  };

  // HANDLE DELETE UPLOAD IMAGE
  const handleFileDelete = (index: number) => () => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onFilesChange(newFiles);
  };

  // Clean up completed or error uploads
  const cleanupCompletedUploads = () => {
    setUploadStatus((prev) =>
      prev.filter(
        (item) => item.status !== "success" && item.status !== "error"
      )
    );
  };

  // Cleanup effect when status changes
  useEffect(() => {
    const successOrErrorItems = uploadStatus.filter(
      (item) => item.status === "success" || item.status === "error"
    );

    if (successOrErrorItems.length > 0) {
      // Use a timeout to avoid immediate removal of visual feedback
      const timer = setTimeout(cleanupCompletedUploads, 1000);
      return () => clearTimeout(timer);
    }
  }, [uploadStatus]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = files.indexOf(active.id as string);
      const newIndex = files.indexOf(over.id as string);
      const newFiles = arrayMove(files, oldIndex, newIndex);
      onFilesChange(newFiles);
    }
  };

  return (
    <>
      <DropZone
        title={title}
        imageSize="Recommended size 600*500px"
        onChange={(files) => handleChangeDropZone(files)}
      />

      <div className="flex flex-row mt-2 flex-wrap gap-1">
        {/* Show loading states for files being uploaded */}
        {uploadStatus
          .filter(
            (item) => item.status === "uploading" || item.status === "pending"
          )
          .map((item, index) => (
            <div key={`loading-${index}`} className="relative">
              <LoadingImageBox file={item.file} />
            </div>
          ))}

        {/* Show successfully uploaded files with drag-and-drop */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}>
          <SortableContext items={files}>
            {files.map((file_path) => (
              <div key={file_path} className="relative">
                <SortableImage
                  id={file_path}
                  file_path={file_path}
                  isSelected={selectedImages.includes(file_path)}
                  onSelectImage={onSelectImage}
                />
                <button
                  onClick={handleFileDelete(files.indexOf(file_path))}
                  className="absolute top-1 right-1 text-sm z-10 bg-white rounded-full p-0.5 shadow-sm hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
};

export default FileUploaderAsyncV2;

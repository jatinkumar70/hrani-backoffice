export interface IFileUploadProps {
  heading?: string;
  value: string | IFileUpload[] | null;
  multiple?: boolean;
  disabled?: boolean;
  deleteDisabled?: boolean;
  onMultiChange?: (data: IFileUpload[]) => void;
  onChange?: (file: File) => void;
  onDelete?: () => void;
}

export interface IFileUpload {
  key?: string;
  path: string | null;
  file: File | null;
  name?: string;
}

export interface IFileUploadV2Props {
  height?: string;
  value: string | IFileUpload[] | null;
  file?: File;
  onChange?: (file: File) => void;
  onDelete?: () => void;
  multiple?: boolean;
  disabled?: boolean;
  deleteDisabled?: boolean;
  onMultiChange?: (data: IFileUpload[]) => void;
  actionButton?: {
    text: string;
    onClick?: () => void;
  };
}

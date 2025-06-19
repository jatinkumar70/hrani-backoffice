import { server_base_api } from "@/utils/api";
import { IFileUpload } from "../FileUpload.type";

export const uploadFile = async (
  file: File | null,
  module_name: string,
  defaultReturn: string,
  asPayload: {
    [key: string]: string | number | null;
  },
  options?: {
    [key: string]: any;
  }
) => {
  if (!file) return defaultReturn;

  console.log(file);
  console.log(defaultReturn);

  const formdata = new FormData();
  formdata.append("files", file);
  formdata.append("module_name", module_name);
  formdata.append("as_payload", JSON.stringify(asPayload));
  if (options) {
    formdata.append("options", JSON.stringify(options));
  }

  try {
    const res = await server_base_api.post("/general/upload-files", formdata);
    const data: string[] = res.data.data;
    console.log(data);
    if (data.length > 0) {
      const url = `${import.meta.env.VITE_S3_PUBLIC_PREFIX_URL}/${data[0]}`;
      console.log(url);
      return url;
    }
  } catch (error) {
    console.error("Upload failed", error);
  }

  return defaultReturn;
};


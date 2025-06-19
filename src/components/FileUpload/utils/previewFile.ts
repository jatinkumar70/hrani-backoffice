import { api } from "utils/api";
import {
  getFileExtensionFromUrl,
} from "./getFileNameFromUrl";

export const previewFile = async (fileName: string | null) => {
  if (fileName) {
    const res = await api.post(
      "/general/download-files",
      {
        type: "",
        keys: [fileName],
      },
      {
        responseType: "arraybuffer",
      }
    );
    console.log(res);
    // const buffer = Buffer.from(res.data);
    const blob = new Blob([res.data], {
      type: "application/" + getFileExtensionFromUrl(fileName),
    });
    // const blob = new Blob([res.data], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
  }
  return null;
};

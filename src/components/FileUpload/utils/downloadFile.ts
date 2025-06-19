import { api } from "utils/api";
import {  getFileExtensionFromUrl, getFileNameFromUrl } from "./getFileNameFromUrl";

export const downLoadFile = async (fileName: string | null) => {
    if (fileName) {
      const res = await api.post(
        "/general/download-files",
        {
          type: "",
          keys: [fileName],
        },
        {
          responseType: "arraybuffer", 
        },
      );
      console.log(res);
      // const buffer = Buffer.from(res.data);
      const blob = new Blob([res.data], { type: 'application/'+getFileExtensionFromUrl(fileName) });
      // const blob = new Blob([res.data], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
  
      // Create a link element and simulate a click to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", getFileNameFromUrl(fileName)); // Set the desired file name and extension
      document.body.appendChild(link);
      link.click();
  
      // Clean up by revoking the URL object
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }
    return null;
  };
  
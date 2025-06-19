

export type IFileExtension = "IMAGE" | "PDF" | "EXCEL" | "OTHER" | "TEXT" | "VIDEO" | "AUDIO";

export const getFileExtension = (fileName: string): string => {
    if (!fileName || !fileName.includes(".")) return "";
    return fileName.split(".").pop()?.toLocaleLowerCase() ?? "";
};

export const getFileExtensionType = (fileName: string): IFileExtension => {
    if (!fileName || typeof fileName !== "string") {
        return "OTHER";
    }
    const extension = fileName?.split(".").pop()?.toLocaleLowerCase();
    if (
        extension === "jpg" ||
        extension === "jpeg" ||
        extension === "png" ||
        extension === "webp" ||
        extension === "jfif" ||
        extension === "tif"
    )
        return "IMAGE";
    if (extension === "pdf") return "PDF";
    if (extension === "xls" || extension === "xlsx") return "EXCEL";
    if (extension === "text") return "TEXT";
    if (extension === "mp4") return "VIDEO";
    if (extension === "mp3") return "AUDIO";
    return "OTHER";
};


export const getFileNameFromPathSync = (fileName: string): string => {
    return fileName.split("/").pop() || "";
};

export const getFileMimeType = (extension: string): string => {
    const fileType = getFileExtensionType(extension);
    if (fileType === "IMAGE") return `data:image/${extension};base64`;
    if (fileType === "EXCEL") return `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64`;
    if (fileType === "PDF") return `application/${extension}`;
    return "application/octet-stream"
};




export const convertFileBufferToPreviewableUrl = (buffer: ArrayBuffer, extension: string): string => {
    // const data = `${btoa(
    //     new Uint8Array(buffer).reduce(function (data, byte) {
    //         return data + String.fromCharCode(byte);
    //     }, ""),
    // )}`;
    // const byteCharacters = atob(data);
    // const byteArrays = [];

    // for (let i = 0; i < byteCharacters.length; i += 512) {
    //     const slice = byteCharacters.slice(i, i + 512);
    //     const byteNumbers = new Array(slice.length);
    //     for (let j = 0; j < slice.length; j++) {
    //         byteNumbers[j] = slice.charCodeAt(j);
    //     }
    //     byteArrays.push(new Uint8Array(byteNumbers));
    // }

    // Create Blob and Object URL
    const blob = new Blob([buffer], { type: getFileMimeType(extension) });
    return URL.createObjectURL(blob);
};



export const downloadSingleFileSync = (fileUrl: string, filename: string) => {
    // Create a link element and simulate a click to trigger the download
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", filename); // Set the desired file name and extension
    document.body.appendChild(link);
    link.click();

    // Clean up by revoking the URL object
    window.URL.revokeObjectURL(fileUrl);
    document.body.removeChild(link);
}
import { api, server_base_api } from "@/utils/api";
import { IFileUpload } from "./FileUpload.type";
import { axiosConsoleError } from "@/utils/axios-api.helpers";


export const uploadMultipleFile = async (
    files: IFileUpload[],
    module_name: string,
    asPayload: {
        [key: string]: string | number | null;
    }
) => {
    try {
        let filesCount = 0;
        const formdata = new FormData();
        for (let file of files) {
            if (file.file) {
                filesCount++;
                formdata.append("files", file.file);
            }
        }
        formdata.append("module_name", module_name);
        formdata.append("as_payload", JSON.stringify(asPayload));
        if (filesCount === 0) {
            return {
                files,
                paths: files.map((item) => item.path),
            };
        }
        const res = await server_base_api.post("/general/upload-files", formdata);
        const data: string[] = res.data.data;

        const finalList = [];
        let i = 0;
        if (data.length > 0) {
            for (let item of files) {
                const url = `${process.env["VITE_S3_PUBLIC_PREFIX_URL"]}/${data[i]}`;
                const obj = { ...item };
                if (item.file) {
                    obj.file = null;
                    obj.path = url;
                    i++;
                }
                finalList.push(obj);
            }

            return {
                files: finalList,
                paths: finalList.map((item) => item.path),
            };
        }

        return {
            files,
            paths: files.map((item) => item.path),
        };
    } catch (error) {
        axiosConsoleError(error);
        return {
            files,
            paths: [],
        };
    }
};

export const mergeFiles = async (files: IFileUpload[]) => {
    let filesCount = 0;
    let fileName = "";

    const formdata = new FormData();
    for (let file of files) {
        if (filesCount === 0) {
            fileName = file.name || "";
        }
        if (file.file) {
            filesCount++;
            formdata.append("files", file.file);
        }
    }
    if (filesCount === 0) {
        return {
            files,
            paths: files.map((item) => item.path),
        };
    }
    const res = await api.post("/general/merge-pdfs", formdata, {
        responseType: "arraybuffer",
    });
    const blob = new Blob([res.data], { type: "application/pdf" });

    // Create a File from the Blob with the specified file name
    const file = new File([blob], fileName, { type: "application/pdf" });

    return {
        file,
    };
};

export const uploadMultipleFileV2 = async (
    files: File[],
    module_name: string,
    asPayload: {
        [key: string]: string | number | null;
    },
    onProgress?: (file: File, status: string) => void
): Promise<string[]> => {
    const allPaths: string[] = [];

    for (const file of files) {
        const formdata = new FormData();
        formdata.append("files", file); // One file per request
        formdata.append("module_name", module_name);
        formdata.append("as_payload", JSON.stringify(asPayload));

        try {
            onProgress?.(file, "uploading");
            const res = await server_base_api.post("/general/upload-files", formdata);
            const data: string[] = res.data.data;
            allPaths.push(...data);
            onProgress?.(file, "success");
        } catch (error) {
            console.error(`Upload failed for file: ${file.name}`, error);
            onProgress?.(file, "error");
        }
    }

    return allPaths;
};

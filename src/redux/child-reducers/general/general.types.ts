import { ILoadState } from "@/redux/store.enums";
import { IPostWrapperWithCallback } from "src/redux/store.types";



// {
//     "path": "company_information/ABC/resume1.pdf",
//         "size": "159.92 KB",
//             type: "folder",
//                 "last_modified": "January 22, 2025 at 09:35:27 AM"
// },


export interface IFileManager {
    name: string,
    path: string,
    size: string,
    type: string,
    file_type: string;
    last_modified: string
    lastModified: string
}

export interface IMoveFile {
    src: string,
    dest: string
}
export interface IRenameFolder {
    oldFolderName: string,
    newFolderName: string
}
export interface IRenameFile {
    oldKey: string,
    newKey: string
}

export interface IMoveFileWithCallback extends IPostWrapperWithCallback<IMoveFile, IMoveFile> { }
export interface IRenameFolderWithCallback extends IPostWrapperWithCallback<IRenameFolder, IRenameFolder> { }
export interface IRenameFileWithCallback extends IPostWrapperWithCallback<IRenameFile, IRenameFile> { }


export interface IRecordCount {
    status: string,
    count: number
}

export interface IGeneralState {
    files_and_folders_list: {
        loading: ILoadState
        data: IFileManager[]
        count: number;
        error: string | null;
    },
    record_count: {
        loading: ILoadState
        data: IRecordCount[]
        count: number;
        error: string | null;
    },
}
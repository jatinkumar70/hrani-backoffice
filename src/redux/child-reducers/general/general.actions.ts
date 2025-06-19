import { createAsyncThunk } from "@reduxjs/toolkit";
import { axios_Loading_messages, server_base_endpoints } from "@/api";
import axios_base_api from "@/api/axios-base-api";
import { ISearchQueryParamsV2 } from "@/redux/store.types";
import { getSearchQueryParamsV2 } from "@/redux/store.utils";
import { createAsyncThunkPostWrapper } from "@/redux/store.wrapper";
import { openSnackbarDialog } from "../loading-and-snackbar";
import {
    IFileManager,
    IMoveFile, IMoveFileWithCallback, IRecordCount, IRenameFileWithCallback,
    IRenameFolderWithCallback
} from "./general.types";
import { getFileManagerTypedData } from "./general.helpers";


// #########################################################################################################
// ####################################### General Module #################################################
// #########################################################################################################

export const fetchRecordCountAsync = createAsyncThunk<{ count: number, data: IRecordCount[] }, ISearchQueryParamsV2>(
    'general/fetchRecordCountAsync', async (queryParams) => {
        const searchQuery = getSearchQueryParamsV2(queryParams);
        const response = await axios_base_api.get(`${server_base_endpoints.general.get_record_counts}${searchQuery}`)
        const { data } = response.data;
        const count = response.data.totalRecords
        return { count, data }
    },
)

// export const fetchMultipleCustomersWithArgsAsync = createAsyncThunk<{ count: number, data: ICustomer[] }, ISearchQueryParamsV2>(
//     'general/fetchMultipleCustomersWithArgsAsync', async (queryParams, thunkAPI) => {
//         const searchQuery = getSearchQueryParamsV2(queryParams);
//         const response = await axios_base_api.get(`${server_base_endpoints.customers.get_customers}${searchQuery}`)
//         const { data, totalRecords: count } = response.data;
//         return thunkAPI.fulfillWithValue({ count, data })
//     }
// )


// export const fetchSingleCustomerWithArgsAsync = createAsyncThunkGetWrapper<ICustomer, string>(
//     'general/fetchSingleCustomerWithArgsAsync', async (uuid, thunkAPI) => {
//         const response = await axios_base_api.get(`${server_base_endpoints.customers.get_customers}?customer_uuid=${uuid}`)
//         return thunkAPI.fulfillWithValue(response.data.data[0])
//     },
// )

// ---- Get Files And Folders From S3 -------------------------
export const fetchFilesAndFoldersFromS3BucketAsync = createAsyncThunkPostWrapper<IFileManager[], string>(
    'general/getFilesAndFoldersFromS3BucketAsync', async (path, thunkAPI) => {
        const response = await axios_base_api.post(server_base_endpoints.general.file_explorer, {
            keys: [path]
        })
        return thunkAPI.fulfillWithValue(getFileManagerTypedData(response.data.data))
    },
)

// ---- Move Single File From One Folder To Another -------------------------
export const moveFilesFromOneFolderToAnotherWithCallbackAsync = createAsyncThunkPostWrapper<IMoveFile, IMoveFileWithCallback>(
    'general/moveFilesFromOneFolderToAnotherWithCallbackAsync', async ({ payload, onSuccess }, thunkAPI) => {
        const response = await axios_base_api.post(server_base_endpoints.general.file_move, payload)
        if (response.status === 200) {
            onSuccess(true, response.data.data)
            thunkAPI.dispatch(openSnackbarDialog({
                variant: "success",
                message: axios_Loading_messages.save_success
            }))
            return thunkAPI.fulfillWithValue(response.data.data)
        }

        onSuccess(false)
        thunkAPI.dispatch(openSnackbarDialog({
            variant: "error",
            message: axios_Loading_messages.save_error

        }))
        return thunkAPI.rejectWithValue(response.status)
    },
)
// ---- Rename Single Folder ------------------------------------------------
export const renameSingleFolderWithCallbackAsync = createAsyncThunkPostWrapper<IFileManager[], IRenameFolderWithCallback>(
    'general/renameSingleFolderWithCallbackAsync', async ({ payload, onSuccess }, thunkAPI) => {
        const response = await axios_base_api.post(server_base_endpoints.general.file_rename_folder, payload)
        thunkAPI.dispatch(openSnackbarDialog({
            variant: "success",
            message: axios_Loading_messages.save_success
        }))
        const ondList = thunkAPI.getState().general.files_and_folders_list.data;
        const newList = ondList.map((data) => {
            if (data.path === payload.oldFolderName) {
                return { ...data, path: payload.newFolderName }
            }
            return data
        })
        onSuccess(true, response.data.data)
        return thunkAPI.fulfillWithValue(getFileManagerTypedData(newList))

    },
)
// ---- Rename Single File --------------------------------------------------
export const renameSingleFileWithCallbackAsync = createAsyncThunkPostWrapper<IFileManager[], IRenameFileWithCallback>(
    'general/renameSingleFileWithCallbackAsync', async ({ payload, onSuccess }, thunkAPI) => {
        const response = await axios_base_api.post(server_base_endpoints.general.file_rename, payload)
        onSuccess(true, response.data.data)
        thunkAPI.dispatch(openSnackbarDialog({
            variant: "success",
            message: axios_Loading_messages.save_success
        }))
        const ondList = thunkAPI.getState().general.files_and_folders_list.data;
        const newList = ondList.map((data) => {
            if (data.path === payload.oldKey) {
                return { ...data, path: payload.newKey }
            }
            return data
        })
        return thunkAPI.fulfillWithValue(getFileManagerTypedData(newList))
    },
)

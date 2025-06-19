import { createAsyncThunk } from "@reduxjs/toolkit"
import { IComment } from "./comments.types"
import { server_base_endpoints } from "@/api";
import axios_base_api from "@/api/axios-base-api";




export const fetchMultipleCommentsWithArgsAsync = createAsyncThunk<{ count: number, data: IComment[] }, string>(
    'comment/fetchMultipleCommentsWithArgsAsync', async (module_uuid, thunkAPI) => {
        try {
            // const searchQuery = getSearchQueryParamsV2(queryParams);
            const response = await axios_base_api.get(`${server_base_endpoints.comments.get_commnet}?module_uuid=${module_uuid}`)
            const { data } = response.data;
            const count = response.data.totalRecords
            return thunkAPI.fulfillWithValue({ count, data })
        } catch (error: any) {
            alert(error.message)
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)



interface IUpsertSinglePrivateLeadWithCallback {
    payload: IComment,
    onSuccess: (isSuccess: boolean, data?: IComment) => void
}

export const upsertSingleCommentWithCallbackAsync = createAsyncThunk<IComment, IUpsertSinglePrivateLeadWithCallback>(
    'comment/upsertSingleCommentWithCallbackAsync', async ({ payload, onSuccess }, thunkAPI) => {
        try {
            // const response = await axios_base_api.post(server_base_endpoints.leads.upsert_private_leads, payload)
            const response = await axios_base_api.post(server_base_endpoints.comments.upsert_commnet, payload);
            if (response.status === 200) {
                onSuccess(true, response.data.data)
                thunkAPI.dispatch(fetchMultipleCommentsWithArgsAsync(payload.module_uuid))
                thunkAPI.dispatch(fetchMultipleCommentsWithArgsAsync(payload.module_uuid))
                return thunkAPI.fulfillWithValue(response.data.data)
            }
            onSuccess(false)
            return thunkAPI.rejectWithValue(response.status)
        } catch (error: any) {
            alert(error.message)
            return thunkAPI.rejectWithValue(error.message)
        }
    },
)
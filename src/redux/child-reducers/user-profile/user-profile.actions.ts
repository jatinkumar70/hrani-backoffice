// #########################################################################################################
// #################################### Private Lead Module ################################################

import { createAsyncThunk } from '@reduxjs/toolkit'
import { ICreateNewUser, IUserProfile } from './user-profile.types'
// import axios_base_api, { axios_Loading_messages, server_base_endpoints } from "@/api";
import { ISearchQueryParamsV2 } from '@/redux/store.types'
import { getSearchQueryParamsV2 } from '@/redux/store.utils'
import {
    closeLoadingDialog,
    openLoadingDialog,
    openSnackbarDialog,
} from '../loading-and-snackbar'
import {
    createAsyncThunkGetWrapper,
    createAsyncThunkPostWrapper,
} from '@/redux/store.wrapper'
import axios_base_api, { axios_Loading_messages } from '@/api/axios-base-api'
import { server_base_endpoints } from '@/api'

// #########################################################################################################
export const fetchMultipleUsersAsync = createAsyncThunk<{
    count: number
    data: IUserProfile[]
}>('user_profile/fetchMultipleUsersAsync', async () => {
    const response = await axios_base_api.get(
        server_base_endpoints.users.get_users,
    )
    const { data } = response.data
    const count = response.data.totalRecords
    return { count, data }
})

export const fetchMultipleUsersWithArgsAsync = createAsyncThunk<
    { count: number; data: IUserProfile[] },
    ISearchQueryParamsV2
>(
    'user_profile/fetchMultipleUsersWithArgsAsync',
    async (queryParams, thunkAPI) => {
        const searchQuery = getSearchQueryParamsV2(queryParams)
        const response = await axios_base_api.get(
            `${server_base_endpoints.users.get_users}${searchQuery}`,
        )
        const { data, totalRecords: count } = response.data
        return thunkAPI.fulfillWithValue({ count, data })
    },
)

export const fetchSingleUserProfileWithArgsAsync = createAsyncThunkGetWrapper<
    IUserProfile,
    string
>(
    'user_profile/fetchSingleUserProfileWithArgsAsync',
    async (uuid, thunkAPI) => {
        const response = await axios_base_api.get(
            `${server_base_endpoints.users.get_users}?user_uuid=${uuid}`,
        )
        console.log(
            'fetchSingleUserProfileWithArgsAsync API response:',
            response.data,
        ) // Add this line
        return thunkAPI.fulfillWithValue(response.data.data[0])
    },
)

export interface IUpsertSingleUserProfileWithCallback {
    payload: IUserProfile
    onSuccess: (isSuccess: boolean, data?: IUserProfile) => void
}
export const upsertSingleUserProfileWithCallbackAsync =
    createAsyncThunkPostWrapper<
        IUserProfile,
        IUpsertSingleUserProfileWithCallback
    >(
        'private_leads/upsertSingleUserProfileWithCallbackAsync',
        async ({ payload, onSuccess }, thunkAPI) => {
            // thunkAPI.dispatch(openLoadingDialog(axios_Loading_messages.upload))
            const {
                user_fact_id,
                user_dim_id,
                full_name,
                user_profile_id,
                email,
                insert_ts,
                create_ts,
                password,
                confirmPassword,
                role_uuid,
                role_value,
                name,
                username,
                ...restPayload
            } = payload


            const response = await axios_base_api.post(
                server_base_endpoints.users.upsert_profile,
                restPayload,
            )
            if (response.status === 200) {
                onSuccess(true, response.data.data)
                thunkAPI.dispatch(
                    openSnackbarDialog({
                        variant: 'success',
                        message: axios_Loading_messages.save_success,
                    }),
                )
                return thunkAPI.fulfillWithValue(response.data.data)
            }

            onSuccess(false)
            thunkAPI.dispatch(
                openSnackbarDialog({
                    variant: 'error',
                    message: axios_Loading_messages.save_error,
                }),
            )
            return thunkAPI.rejectWithValue(response.status)
        },
    )

export interface IPostNewUserWithCallback {
    payload: ICreateNewUser
    onCallback: (isSuccess: boolean, data?: ICreateNewUser) => void
}
export const createNewUserWithCallbackAsync = createAsyncThunkPostWrapper<
    IUserProfile,
    IPostNewUserWithCallback
>(
    'private_leads/createNewUserWithCallbackAsync',
    async ({ payload, onCallback }, thunkAPI) => {
        thunkAPI.dispatch(openLoadingDialog(axios_Loading_messages.save))
        const response = await axios_base_api.post(
            server_base_endpoints.users.create_new_user,
            payload,
        )
        if (response.status === 200) {
            onCallback(true, response.data.data)
            thunkAPI.dispatch(
                fetchMultipleUsersWithArgsAsync({ page: 1, rowsPerPage: 10 }),
            )
            return thunkAPI.fulfillWithValue(response.data.data)
        }
        onCallback(false)
        return thunkAPI.rejectWithValue(response.status)
    },
)

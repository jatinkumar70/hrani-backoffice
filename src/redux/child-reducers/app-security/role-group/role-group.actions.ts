import { ISecurityRoleGroup } from './role-group.types'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { server_base_endpoints } from '@/api'
import axios_base_api from '@/api/axios-base-api'

export const fetchSecurityRoleGroupListAsync = createAsyncThunk<
    { count: number; data: ISecurityRoleGroup[] },
    { page: number; rowsPerPage: number }
>(
    'role_groups/fetchSecurityRoleGroupListAsync',
    async ({ page, rowsPerPage }, thunkAPI) => {
        try {
            const response = await axios_base_api.get(
                `${server_base_endpoints.security.get_role_groups}?pageNo=${page}&itemPerPage=${rowsPerPage}`,
            )

            const { data, totalRecords: count } = response.data
            return { count, data }
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message)
        }
    },
)

export interface IUpsertSecurityRoleGroup {
    payload: ISecurityRoleGroup
    onSuccess: (isSuccess: boolean, data?: ISecurityRoleGroup) => void
}
export const upsertSecurityRoleGroupAsync = createAsyncThunk<
    ISecurityRoleGroup,
    IUpsertSecurityRoleGroup
>(
    'role_groups/upsertSecurityRoleGroupAsync',
    async ({ payload, onSuccess }, thunkAPI) => {
        try {
            const { create_ts, insert_ts, ...restPayload } = payload
            const response = await axios_base_api.post(
                server_base_endpoints.security.upsert_role_group,
                restPayload,
            )
            if (response.status === 200) {
                onSuccess(true, response.data.data)
                thunkAPI.dispatch(
                    fetchSecurityRoleGroupListAsync({
                        page: 1,
                        rowsPerPage: 50,
                    }),
                )
                return thunkAPI.fulfillWithValue(response.data.data)
            }

            onSuccess(false)
            return thunkAPI.rejectWithValue(response.status)
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message)
        }
    },
)

// export const CLEAR_SECURITY_ROLE_GROUP_LIST = "CLEAR_SECURITY_ROLE_GROUP_LIST";
// export const clearSecurityRoleGroupListAsync = () =>
//   action(CLEAR_SECURITY_ROLE_GROUP_LIST);

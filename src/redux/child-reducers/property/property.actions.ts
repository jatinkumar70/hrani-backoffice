import type { ISearchQueryParamsV2 } from '@/redux/store.types'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { axios_Loading_messages, server_base_endpoints } from '@/api'
import axios_base_api from '@/api/axios-base-api'
import { getSearchQueryParamsV2 } from '@/redux/store.utils'
import type { IProperty } from './property.types'
// import { openLoadingDialog } from "../../loading-and-snackbar";
import { createAsyncThunkPostWrapper } from '@/redux/store.wrapper'
import { IDynamicFileObject } from '@/types'
import { openLoadingDialog } from '../loading-and-snackbar'
import { vite_app_routes } from '@/router/vite-app-routes'
import { apiFrontendUrl } from '@/utils/api'
import { InventoryItem } from '@/views/app/admin/inventory/types'
import { toast } from 'react-toastify'
import { Notification } from '@/components/ui'

// Fetch multiple properties
export const fetchMultiplePropertiesAsync = createAsyncThunk<{
    count: number
    data: IProperty[]
}>('property/fetchMultiplePropertiesAsync', async () => {
    const response = await axios_base_api.get(
        server_base_endpoints.property.get_property,
    )
    const { data, totalRecords: count } = response.data
    return { count, data }
})

// Fetch multiple properties with query parameters
export const fetchMultiplePropertiesWithArgsAsync = createAsyncThunk<
    { count: number; data: IProperty[] },
    ISearchQueryParamsV2
>(
    'property/fetchMultiplePropertiesWithArgsAsync',
    async (queryParams: ISearchQueryParamsV2, thunkAPI) => {
        try {
            console.log(queryParams, '.....')

            const searchQuery = getSearchQueryParamsV2(queryParams)
            const response = await axios_base_api.get(
                `${server_base_endpoints.property.get_property}${searchQuery}`,
            )
            const { data, totalRecords: count } = response.data
            return thunkAPI.fulfillWithValue({ count, data })
        } catch (error: any) {
            alert(error.message)
            return thunkAPI.rejectWithValue(error.message)
        }
    },
)

// Fetch a single property
export const fetchSinglePropertyWithArgsAsync = createAsyncThunk<
    IProperty,
    string
>('property/fetchSinglePropertyWithArgsAsync', async (uuid, thunkAPI) => {
    try {
        const response = await axios_base_api.get(
            `${server_base_endpoints.property.get_property}?property_details_uuid=${uuid}`,
        )
        return thunkAPI.fulfillWithValue(response.data.data[0])
    } catch (error: any) {
        alert(error.message)
        return thunkAPI.rejectWithValue(error.message)
    }
})

// Create or update property
export interface IUpsertSinglePropertyWithCallback {
    payload: IProperty
    documents?: IDynamicFileObject
    onSuccess: (isSuccess: boolean, data?: IProperty) => void
}

// Create property
export const createPropertyWithCallbackAsync = createAsyncThunkPostWrapper<
    IProperty,
    IUpsertSinglePropertyWithCallback
>(
    'property/createPropertyWithCallbackAsync',
    async ({ payload, documents, onSuccess }, thunkAPI) => {
        thunkAPI.dispatch(openLoadingDialog(axios_Loading_messages.save))
        try {
            const response = await axios_base_api.post(
                server_base_endpoints.property.create_property,
                payload,
            )
            if (response.status === 200) {
                onSuccess(true, response.data.data)
                return thunkAPI.fulfillWithValue(response.data.data)
            }

            onSuccess(false)
            return thunkAPI.rejectWithValue(response.status)
        } catch (error: any) {
            onSuccess(false)
            return thunkAPI.rejectWithValue(error.message)
        }
    },
)

// Update property
export const upsertPropertyWithCallbackAsync = createAsyncThunkPostWrapper<
    IProperty,
    IUpsertSinglePropertyWithCallback
>(
    'property/upsertPropertyWithCallbackAsync',
    async ({ payload, documents, onSuccess }, thunkAPI) => {
        thunkAPI.dispatch(openLoadingDialog(axios_Loading_messages.save))
        try {
            const response = await axios_base_api.post(
                server_base_endpoints.property.upsert_property,
                payload,
            )
            if (response.status === 200) {
                onSuccess(true, response.data.data)
                return thunkAPI.fulfillWithValue(response.data.data)
            }

            onSuccess(false)
            return thunkAPI.rejectWithValue(response.status)
        } catch (error: any) {
            onSuccess(false)
            return thunkAPI.rejectWithValue(error.message)
        }
    },
)

// Get property public URL
export const getPropertyPublicUrl = (slug: string): string => {
    return `${apiFrontendUrl}/property/${slug}`
}

// Get property edit URL
export const getPropertyEditUrl = (uuid: string): string => {
    return `${vite_app_routes.app.admin.properties}/edit/${uuid}`
}

// Refresh property list / single property
interface Params {
    propertyId?: string
    page?: number
    id?: string
}

export const insertPropertyWithPmsAsync = async (
    { propertyId, page = 1 }: Params,
    onCallback?: (isSuccess: boolean, data?: any) => void
): Promise<void> => {
    try {
        const res = await axios_base_api.post(
            server_base_endpoints.pms.insert_property_with_pms,
            {
                propertyId: propertyId || null,
                page: page,
            }
        )

        const data = res.data
        toast.success("Properties refreshed successfully!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        })

        if (onCallback) {
            onCallback(true, data)
        }
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || 'Something went wrong'
        toast.error(errorMessage, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        })

        if (onCallback) {
            onCallback(false)
        }
    }
}

// Define the parameters for fetching inventory
interface IFetchInventoryParams {
    property_details_uuid: string
    from_date?: string | null
    to_date?: string | null
}

// Fetch inventory action
export const fetchInventoryAsync = createAsyncThunk<
    InventoryItem[],
    IFetchInventoryParams
>(
    'inventory/fetchInventoryAsync',
    async (params: IFetchInventoryParams, thunkAPI) => {
        try {
            thunkAPI.dispatch(openLoadingDialog('Loading inventory...'))

            const response = await axios_base_api.get(
                server_base_endpoints.inventory.get_inventory,
                {
                    params: {
                        property_details_uuid: params.property_details_uuid,
                        from_date: params.from_date,
                        to_date: params.to_date,
                    },
                },
            )

            return response.data
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message)
        }
    },
)

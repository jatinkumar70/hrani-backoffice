import { createAsyncThunk } from "@reduxjs/toolkit"
import { axios_Loading_messages, server_base_endpoints } from "@/api";
import axios_base_api from "@/api/axios-base-api";
import { IDocument, ISignDocument } from "./documents.types"
import { createAsyncThunkPostWrapper } from "@//redux/store.wrapper"
import { ISearchQueryParamsV2 } from "@/redux/store.types"
import { getSearchQueryParamsV2 } from "@//redux/store.utils"
import { closeLoadingDialog, openLoadingDialog } from "../../loading-and-snackbar"

const base_endpoint = server_base_endpoints.leads.leads

// #########################################################################################################
// ############################### Fetch All Documents Document ##########################################
// #########################################################################################################
export const fetchMultipleDocumentsAsync = createAsyncThunk<{ count: number, data: IDocument[] }, ISearchQueryParamsV2>(
    'private_leads/fetchMultipleDocumentsAsync', async (queryParams, thunkAPI) => {
        try {
            const searchQuery = getSearchQueryParamsV2(queryParams);
            const response = await axios_base_api.get(`${base_endpoint.signature_history}${searchQuery}`)
            const { data, totalRecords: count } = response.data;
            return thunkAPI.fulfillWithValue({ count, data })
        } catch (error: any) {
            alert(error.message)
            return thunkAPI.rejectWithValue(error.message)
        }
    },
)
export const fetchMultipleDocumentForLeadsAsync = createAsyncThunk<{ count: number, data: IDocument[] }, string>(
    'private_leads/fetchMultipleDocumentForLeadsAsync', async (uuid, thunkAPI) => {
        try {
            const response = await axios_base_api.get(`${base_endpoint.signature_history}?module_uuid=${uuid}`)
            const { data, totalRecords: count } = response.data;
            return thunkAPI.fulfillWithValue({ count, data })
        } catch (error: any) {
            alert(error.message)
            return thunkAPI.rejectWithValue(error.message)
        }
    },
)

// #########################################################################################################
// #################################### Sign Lead Document  ################################################
// #########################################################################################################
export const sendSignDocumentEmailAsync = createAsyncThunkPostWrapper<ISignDocument, ISignDocument>(
    'private_leads/sendSignDocumentEmailAsync', async (payload, thunkAPI) => {
        const response = await axios_base_api.post(base_endpoint.sign_document, payload)
        if (response.status === 200) {
            return thunkAPI.fulfillWithValue(response.data.data)
        }
        return thunkAPI.rejectWithValue(response.status)
    },
)


// #########################################################################################################
// ############################### Generate Sigened Document ##########################################
// #########################################################################################################
export const generateSignedDocumentAsync = createAsyncThunk<{ count: number, data: IDocument[] }, string>(
    'private_leads/fetchSingleLeadActivityAsync', async (document_code, thunkAPI) => {
        try {
            thunkAPI.dispatch(openLoadingDialog("Sending email to your registered email...!"))
            const response = await axios_base_api.get(`${base_endpoint.generate_signed_document}?document_code=${document_code}`)
            const { data, totalRecords: count } = response.data;
            return thunkAPI.fulfillWithValue({ count, data })
        } catch (error: any) {
            alert(error.message)
            return thunkAPI.rejectWithValue(error.message)
        } finally {
            thunkAPI.dispatch(closeLoadingDialog())
        }
    },
)
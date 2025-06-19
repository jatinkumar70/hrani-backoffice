import type { ISearchQueryParamsV2 } from "@/redux/store.types";

import { createAsyncThunk } from "@reduxjs/toolkit";

import { axios_Loading_messages, server_base_endpoints } from "@/api";
import axios_base_api from "@/api/axios-base-api";

import { getSearchQueryParamsV2 } from "@/redux/store.utils";

import type { ILeadActivity, IPrivateLead, IPrivateLeadState, IRetainerAgreement } from "./private-leads.types";
import { closeLoadingDialog, openLoadingDialog } from "@/redux/loading-dialog.actions";
import { createAsyncThunkPostWrapper } from "@/redux/store.wrapper";
import { isNullObjectKeys, uplaodLeadDocuments } from "./private-leads.helpers";
import { IDynamicFileObject } from "@/types";

// #########################################################################################################
// #################################### Private Lead Module ################################################
// #########################################################################################################
export const fetchMultiplePrivateLeadsAsync = createAsyncThunk<{ count: number, data: IPrivateLead[] }>(
    'private_leads/fetchMultiplePrivateLeadsAsync', async () => {
        const response = await axios_base_api.get(server_base_endpoints.leads.leads.get_private_leads)
        const { data, totalRecords: count } = response.data;
        return { count, data }
    },
)

export const fetchMultiplePrivateLeadsWithArgsAsync = createAsyncThunk<{ count: number, data: IPrivateLead[] }, ISearchQueryParamsV2>(
    'private_leads/fetchMultiplePrivateLeadsWithArgsAsync', async (queryParams, thunkAPI) => {
        try {
            const searchQuery = getSearchQueryParamsV2(queryParams);
            const response = await axios_base_api.get(`${server_base_endpoints.leads.leads.get_private_leads}${searchQuery}`)
            const { data, totalRecords: count } = response.data;
            return thunkAPI.fulfillWithValue({ count, data })
        } catch (error: any) {
            alert(error.message)
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)


export const fetchSinglePrivateLeadWithArgsAsync = createAsyncThunk<IPrivateLead, { uuid: string, pointsOnly?: boolean }>(
    'private_leads/fetchSinglePrivateLeadWithArgsAsync', async ({ uuid, pointsOnly }, thunkAPI) => {
        try {
            const response = await axios_base_api.get(`${server_base_endpoints.leads.leads.get_private_leads}?leads_uuid=${uuid}${pointsOnly ? '&only_points=true' : ""}`)
            return thunkAPI.fulfillWithValue(response.data.data[0])
        } catch (error: any) {
            alert(error.message)
            return thunkAPI.rejectWithValue(error.message)
        }
    },
)


export const fetchSingleLeadSuggesionsWithArgsAsync = createAsyncThunk<IPrivateLeadState["single_lead_sugessions"]["data"], string>(
    'private_leads/fetchSingleLeadSuggesionsWithArgsAsync', async (uuid, thunkAPI) => {
        try {
            const response = await axios_base_api.post(`${server_base_endpoints.leads.leads.get_private_lead_suggestions}`, {
                leads_uuid: uuid
            })
            return thunkAPI.fulfillWithValue(response.data.data)
        } catch (error: any) {
            alert(error.message)
            return thunkAPI.rejectWithValue(error.message)
        }
    },
)

export const fetchSingleLeadReportWithArgsAsync = createAsyncThunk<IPrivateLeadState["single_lead_report"]["data"], string>(
    'private_leads/fetchSingleLeadReportWithArgsAsync', async (uuid, thunkAPI) => {
        try {
            const response = await axios_base_api.get(`${server_base_endpoints.leads.leads.get_private_lead_reports}?leads_uuid=${uuid}&isHtml=true`)
            return thunkAPI.fulfillWithValue(response.data.ejsBuffer)
        } catch (error: any) {
            alert(error.message)
            return thunkAPI.rejectWithValue(error.message)
        }
    },
)


export interface IUpsertSinglePrivateLeadWithCallback {
    payload: IPrivateLead,
    documents: IDynamicFileObject,
    onSuccess: (isSuccess: boolean, data?: IPrivateLead) => void
}
export const upsertSinglePrivateLeadWithCallbackAsync = createAsyncThunkPostWrapper<IPrivateLead, IUpsertSinglePrivateLeadWithCallback>(
    'private_leads/upsertSinglePrivateLeadWithCallbackAsync', async ({ payload, documents, onSuccess }, thunkAPI) => {
        thunkAPI.dispatch(openLoadingDialog(axios_Loading_messages.save))
        let { applicant_crs_points, ...lead_payload } = payload;
        if (!isNullObjectKeys(documents)) {
            lead_payload = await uplaodLeadDocuments(documents, lead_payload)
        }

        const response = await axios_base_api.post(server_base_endpoints.leads.leads.upsert_private_leads, lead_payload)
        if (response.status === 200) {
            onSuccess(true, response.data.data)
            return thunkAPI.fulfillWithValue(response.data.data)
        }

        onSuccess(false)
        return thunkAPI.rejectWithValue(response.status)
    },
)



// #########################################################################################################
// ############################### Private Lead Activity Module ##########################################
// #########################################################################################################
export const fetchSingleLeadActivityAsync = createAsyncThunk<{ count: number, data: ILeadActivity[] }, string>(
    'private_leads/fetchSingleLeadActivityAsync', async (uuid, thunkAPI) => {
        try {
            const response = await axios_base_api.get(`${server_base_endpoints.history.get_history}?module_uuid=${uuid}`)
            const { data, totalRecords: count } = response.data;
            return thunkAPI.fulfillWithValue({ count, data })
        } catch (error: any) {
            alert(error.message)
            return thunkAPI.rejectWithValue(error.message)
        }
    },
)






// #########################################################################################################
// ################################ Retainer Aggrement Actions #############################################
// #########################################################################################################


export const fetchRetainerAgrewementWithArgsAsync = createAsyncThunk<{ count: number, data: IRetainerAgreement[] }, { module: "LEAD" | "CUSTOMER", uuid: string }>(
    'private_leads/fetchRetainerAgrewementWithArgsAsync', async ({ module, uuid }, thunkAPI) => {
        try {
            const response = await axios_base_api.get(`${server_base_endpoints.leads.leads.get_retainer_agreement}?${module === "LEAD" ? "module_uuid" : "customer_uuid"}=${uuid}&status=DRAFT`)
            const { data, totalRecords: count } = response.data;
            return thunkAPI.fulfillWithValue({ count, data })
        } catch (error: any) {
            alert(error.message)
            return thunkAPI.rejectWithValue(error.message)
        }
    },
)


export interface IUpsertRetainerAgrewementWithCallback {
    payload: IRetainerAgreement,
    onSuccess: (isSuccess: boolean, data?: IRetainerAgreement) => void
}
export const upsertSingleRetainerAgrewementWithCallbackAsync = createAsyncThunkPostWrapper<IRetainerAgreement, IUpsertRetainerAgrewementWithCallback>(
    'private_leads/upsertSingleRetainerAgrewementWithCallbackAsync', async ({ payload, onSuccess }, thunkAPI) => {
        thunkAPI.dispatch(openLoadingDialog(axios_Loading_messages.save))
        let { create_ts, insert_ts, ...lead_payload } = payload;
        if (lead_payload.retainer_type === "CONSULTATION_AGREEMENT") {
            lead_payload.amount_due_upon_on_this_agreement = 0 as any
            lead_payload.amount_upon_on_this_agreement = 0 as any
        }

        const response = await axios_base_api.post(server_base_endpoints.leads.leads.upsert_retainer_agreement, lead_payload)
        if (response.status === 200) {
            onSuccess(true, response.data.data)
            return thunkAPI.fulfillWithValue(response.data.data)
        }

        onSuccess(false)
        return thunkAPI.rejectWithValue(response.status)
    },
)
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ILoadState } from "@/redux/store.enums";

import { defaultPrivateLeadState } from "./private-leads.state";
import {
    fetchMultiplePrivateLeadsWithArgsAsync, fetchSingleLeadActivityAsync, fetchSingleLeadReportWithArgsAsync,
    fetchSingleLeadSuggesionsWithArgsAsync, fetchSinglePrivateLeadWithArgsAsync, fetchRetainerAgrewementWithArgsAsync
} from "./private-leads.actions";
import { IServiceType } from "./private-leads.types";


const leadsSlice = createSlice({
    initialState: defaultPrivateLeadState,
    name: "leads",
    reducers: {
        changeLeadTypeSync: (state, action: PayloadAction<IServiceType>) => {
            state.single_private_lead.data["service_type"] = action.payload
        },
        clearPrivateLeadsFullStateSync: (state) => {
            return defaultPrivateLeadState
        },
        clearSinglePrivateLeadStateSync: (state) => {
            state.single_private_lead.loading = defaultPrivateLeadState.single_private_lead.loading
            state.single_private_lead.data = defaultPrivateLeadState.single_private_lead.data
            state.single_private_lead.error = defaultPrivateLeadState.single_private_lead.error
        },
        clearSingleRetainerAgreementStateSync: (state) => {
            state.single_retainer_agreement.loading = defaultPrivateLeadState.single_retainer_agreement.loading
            state.single_retainer_agreement.data = defaultPrivateLeadState.single_retainer_agreement.data
            state.single_retainer_agreement.error = defaultPrivateLeadState.single_retainer_agreement.error
        },
    },
    extraReducers: (builder) => {
        // ############################# fetchMultiplePrivateLeadsWithArgsAsync ######################################
        builder.addCase(fetchMultiplePrivateLeadsWithArgsAsync.pending, (state, action) => {
            state.private_leads_list.loading = ILoadState.pending
        })
        builder.addCase(fetchMultiplePrivateLeadsWithArgsAsync.fulfilled, (state, action) => {
            state.private_leads_list.loading = ILoadState.succeeded
            state.private_leads_list.data = action.payload.data
            state.private_leads_list.count = action.payload.count
            state.private_leads_list.error = null
        })
        builder.addCase(fetchMultiplePrivateLeadsWithArgsAsync.rejected, (state, action) => {
            state.private_leads_list.error = action.error.message as string
        })



        // #################################### fetchSinglePrivateLeadWithArgsAsync ##############################################

        builder.addCase(fetchSinglePrivateLeadWithArgsAsync.pending, (state, action) => {
            state.single_private_lead.loading = ILoadState.pending
        })
        builder.addCase(fetchSinglePrivateLeadWithArgsAsync.fulfilled, (state, action) => {
            state.single_private_lead.loading = ILoadState.succeeded
            state.single_private_lead.data = action.payload
            state.single_private_lead.error = null
        })
        builder.addCase(fetchSinglePrivateLeadWithArgsAsync.rejected, (state, action) => {
            state.single_private_lead.error = action.error.message as string
        })



        // ############################# fetchSingleLeadActivityAsync ######################################
        builder.addCase(fetchSingleLeadActivityAsync.pending, (state, action) => {
            state.single_lead_activity.loading = ILoadState.pending
        })
        builder.addCase(fetchSingleLeadActivityAsync.fulfilled, (state, action) => {
            state.single_lead_activity.loading = ILoadState.succeeded
            state.single_lead_activity.data = action.payload.data
            state.single_lead_activity.count = action.payload.count
            state.single_lead_activity.error = null
        })
        builder.addCase(fetchSingleLeadActivityAsync.rejected, (state, action) => {
            state.single_lead_activity.error = action.error.message as string
        })


        // ############################# fetchSingleLeadSuggesionsWithArgsAsync ######################################
        builder.addCase(fetchSingleLeadSuggesionsWithArgsAsync.pending, (state, action) => {
            state.single_lead_sugessions.loading = ILoadState.pending
        })
        builder.addCase(fetchSingleLeadSuggesionsWithArgsAsync.fulfilled, (state, action) => {
            state.single_lead_sugessions.loading = ILoadState.succeeded
            state.single_lead_sugessions.data = action.payload
            state.single_lead_sugessions.error = null
        })
        builder.addCase(fetchSingleLeadSuggesionsWithArgsAsync.rejected, (state, action) => {
            state.single_lead_sugessions.error = action.error.message as string
        })



        // ############################# fetchSingleLeadReportWithArgsAsync ######################################
        builder.addCase(fetchSingleLeadReportWithArgsAsync.pending, (state, action) => {
            state.single_lead_report.loading = ILoadState.pending
        })
        builder.addCase(fetchSingleLeadReportWithArgsAsync.fulfilled, (state, action) => {
            state.single_lead_report.loading = ILoadState.succeeded
            state.single_lead_report.data = action.payload
            state.single_lead_report.error = null
        })
        builder.addCase(fetchSingleLeadReportWithArgsAsync.rejected, (state, action) => {
            state.single_lead_report.error = action.error.message as string
        })


        // #########################################################################################################
        // ################################ Retainer Aggrement Actions #############################################
        // #########################################################################################################
        builder.addCase(fetchRetainerAgrewementWithArgsAsync.pending, (state, action) => {
            state.single_lead_retainer_agreement_list.loading = ILoadState.pending
        })
        builder.addCase(fetchRetainerAgrewementWithArgsAsync.fulfilled, (state, action) => {
            state.single_lead_retainer_agreement_list.loading = ILoadState.succeeded
            state.single_lead_retainer_agreement_list.data = action.payload.data
            state.single_lead_retainer_agreement_list.count = action.payload.count
            state.single_lead_retainer_agreement_list.error = null
        })
        builder.addCase(fetchRetainerAgrewementWithArgsAsync.rejected, (state, action) => {
            state.single_lead_retainer_agreement_list.error = action.error.message as string
        })
    },
});

export const leadsReducer = leadsSlice.reducer;
export const {
    changeLeadTypeSync,
    clearPrivateLeadsFullStateSync,
    clearSinglePrivateLeadStateSync,
    clearSingleRetainerAgreementStateSync
} = leadsSlice.actions;

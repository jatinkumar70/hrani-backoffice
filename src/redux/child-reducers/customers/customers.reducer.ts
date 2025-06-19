import { createSlice } from "@reduxjs/toolkit";

import { ILoadState } from "@/redux/store.enums";
import { defaultCustomerState } from "./customers.state";
import { fetchCustomerMultipleInvoicesWithArgsAsync, fetchCustomerMultipleServicesWithArgsAsync, fetchCustomerSingleInvoiceWithArgsAsync, fetchCustomerSingleServiceWithArgsAsync, fetchMultipleCustomersWithArgsAsync, fetchSingleCustomerWithArgsAsync } from "./customers.actions";




const customersSlice = createSlice({
    initialState: defaultCustomerState,
    name: "customers",
    reducers: {
        clearCustomersFullStateSync: (state) => {
            return defaultCustomerState
        },

        clearCustomersListStateSync: (state) => {
            state.customers_list.loading = defaultCustomerState.customers_list.loading
            state.customers_list.data = defaultCustomerState.customers_list.data
            state.customers_list.error = defaultCustomerState.customers_list.error
        },
        clearSingleCustomerStateSync: (state) => {
            state.single_customer.loading = defaultCustomerState.single_customer.loading
            state.single_customer.data = defaultCustomerState.single_customer.data
            state.single_customer.error = defaultCustomerState.single_customer.error
        },


        clearCustomerServicesListStateSync: (state) => {
            state.customer_services_list.loading = defaultCustomerState.customer_services_list.loading
            state.customer_services_list.data = defaultCustomerState.customer_services_list.data
            state.customer_services_list.error = defaultCustomerState.customer_services_list.error
        },
        clearCustomerSingleServiceStateSync: (state) => {
            state.customer_single_service.loading = defaultCustomerState.customer_single_service.loading
            state.customer_single_service.data = defaultCustomerState.customer_single_service.data
            state.customer_single_service.error = defaultCustomerState.customer_single_service.error
        },

        clearCustomerInvoiceListStateSync: (state) => {
            state.customer_invoice_list.loading = defaultCustomerState.customer_invoice_list.loading
            state.customer_invoice_list.data = defaultCustomerState.customer_invoice_list.data
            state.customer_invoice_list.error = defaultCustomerState.customer_invoice_list.error
        },
        clearCustomerSingleInvoiceStateSync: (state) => {
            state.customer_single_invoice.loading = defaultCustomerState.customer_single_invoice.loading
            state.customer_single_invoice.data = defaultCustomerState.customer_single_invoice.data
            state.customer_single_invoice.error = defaultCustomerState.customer_single_invoice.error
        },
    },
    extraReducers: (builder) => {
        // ############################# fetchMultipleCustomersWithArgsAsync ######################################
        builder.addCase(fetchMultipleCustomersWithArgsAsync.pending, (state, action) => {
            state.customers_list.loading = ILoadState.pending
        })
        builder.addCase(fetchMultipleCustomersWithArgsAsync.fulfilled, (state, action) => {
            state.customers_list.loading = ILoadState.succeeded
            state.customers_list.data = action.payload.data
            state.customers_list.count = action.payload.count
            state.customers_list.error = null
        })
        builder.addCase(fetchMultipleCustomersWithArgsAsync.rejected, (state, action) => {
            state.customers_list.error = action.error.message as string
        })
        // #################################### fetchSingleCustomerWithArgsAsync ##############################################
        builder.addCase(fetchSingleCustomerWithArgsAsync.pending, (state, action) => {
            state.single_customer.loading = ILoadState.pending
        })
        builder.addCase(fetchSingleCustomerWithArgsAsync.fulfilled, (state, action) => {
            state.single_customer.loading = ILoadState.succeeded
            state.single_customer.data = action.payload
            state.single_customer.error = null
        })
        builder.addCase(fetchSingleCustomerWithArgsAsync.rejected, (state, action) => {
            state.single_customer.error = action.error.message as string
        })





        // ############################# fetchCustomerMultipleServicesWithArgsAsync ######################################
        builder.addCase(fetchCustomerMultipleServicesWithArgsAsync.pending, (state, action) => {
            state.customer_services_list.loading = ILoadState.pending
        })
        builder.addCase(fetchCustomerMultipleServicesWithArgsAsync.fulfilled, (state, action) => {
            state.customer_services_list.loading = ILoadState.succeeded
            state.customer_services_list.data = action.payload.data
            state.customer_services_list.count = action.payload.count
            state.customer_services_list.error = null
        })
        builder.addCase(fetchCustomerMultipleServicesWithArgsAsync.rejected, (state, action) => {
            state.customer_services_list.error = action.error.message as string
        })
        // #################################### fetchCustomerSingleServiceWithArgsAsync ##############################################
        builder.addCase(fetchCustomerSingleServiceWithArgsAsync.pending, (state, action) => {
            state.customer_single_service.loading = ILoadState.pending
        })
        builder.addCase(fetchCustomerSingleServiceWithArgsAsync.fulfilled, (state, action) => {
            state.customer_single_service.loading = ILoadState.succeeded
            state.customer_single_service.data = action.payload
            state.customer_single_service.error = null
        })
        builder.addCase(fetchCustomerSingleServiceWithArgsAsync.rejected, (state, action) => {
            state.customer_single_service.error = action.error.message as string
        })



        // ############################# fetchCustomerMultipleInvoicesWithArgsAsync ######################################
        builder.addCase(fetchCustomerMultipleInvoicesWithArgsAsync.pending, (state, action) => {
            state.customer_invoice_list.loading = ILoadState.pending
        })
        builder.addCase(fetchCustomerMultipleInvoicesWithArgsAsync.fulfilled, (state, action) => {
            state.customer_invoice_list.loading = ILoadState.succeeded
            state.customer_invoice_list.data = action.payload.data
            state.customer_invoice_list.count = action.payload.count
            state.customer_invoice_list.error = null
        })
        builder.addCase(fetchCustomerMultipleInvoicesWithArgsAsync.rejected, (state, action) => {
            state.customer_invoice_list.error = action.error.message as string
        })
        // #################################### fetchCustomerSingleInvoiceWithArgsAsync ##############################################
        builder.addCase(fetchCustomerSingleInvoiceWithArgsAsync.pending, (state, action) => {
            state.customer_single_invoice.loading = ILoadState.pending
        })
        builder.addCase(fetchCustomerSingleInvoiceWithArgsAsync.fulfilled, (state, action) => {
            state.customer_single_invoice.loading = ILoadState.succeeded
            state.customer_single_invoice.data = action.payload
            state.customer_single_invoice.error = null
        })
        builder.addCase(fetchCustomerSingleInvoiceWithArgsAsync.rejected, (state, action) => {
            state.customer_single_invoice.error = action.error.message as string
        })
    },
});

export const customersReducer = customersSlice.reducer;
export const {
    clearCustomerServicesListStateSync,
    clearCustomerSingleServiceStateSync,
    clearCustomersFullStateSync,
    clearCustomersListStateSync,
    clearSingleCustomerStateSync,
    clearCustomerInvoiceListStateSync,
    clearCustomerSingleInvoiceStateSync
} = customersSlice.actions;

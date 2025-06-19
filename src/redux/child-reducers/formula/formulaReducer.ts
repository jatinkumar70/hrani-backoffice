import { createSlice } from "@reduxjs/toolkit";
import { ILoadState } from "@/redux/store.enums";
import { initialFormulaState } from "./formula.types";
import { 
    fetchFormulaAsync,
    fetchOTAOptionsAsync,
    fetchBookingSourcesAsync,
    upsertBookingSourceAsync,
    deleteBookingSourceAsync,
    fetchFormulaCalculatorLogsAsync
} from "./formulaActions";

const formulaSlice = createSlice({
    name: "formula",
    initialState: initialFormulaState,
    reducers: {
        clearFormulaStateSync: (state) => {
            return initialFormulaState;
        }
    },
    extraReducers: (builder) => {
        // Original formula actions
        builder.addCase(fetchFormulaAsync.pending, (state) => {
            state.loading = ILoadState.pending;
            state.data = [];
            state.totalRecords = 0;
        });
        builder.addCase(fetchFormulaAsync.fulfilled, (state, action) => {
            state.loading = ILoadState.succeeded;
            state.data = action.payload.data;
            state.totalRecords = action.payload.count;
            state.error = null;
        });
        builder.addCase(fetchFormulaAsync.rejected, (state, action) => {
            state.loading = ILoadState.failed;
            state.error = action.error.message as string;
        });

        // OTA Options actions
        builder.addCase(fetchOTAOptionsAsync.pending, (state) => {
            state.otaOptions.loading = ILoadState.pending;
        });
        builder.addCase(fetchOTAOptionsAsync.fulfilled, (state, action) => {
            state.otaOptions.loading = ILoadState.succeeded;
            state.otaOptions.data = action.payload;
            state.otaOptions.error = null;
        });
        builder.addCase(fetchOTAOptionsAsync.rejected, (state, action) => {
            state.otaOptions.loading = ILoadState.failed;
            state.otaOptions.error = action.error.message as string;
        });

        // Booking Sources actions
        builder.addCase(fetchBookingSourcesAsync.pending, (state) => {
            state.bookingSources.loading = ILoadState.pending;
            state.bookingSources.data = [];
            state.bookingSources.totalRecords = 0;
        });
        builder.addCase(fetchBookingSourcesAsync.fulfilled, (state, action) => {
            state.bookingSources.loading = ILoadState.succeeded;
            state.bookingSources.data = action.payload.data;
            state.bookingSources.totalRecords = action.payload.count;
            state.bookingSources.error = null;
        });
        builder.addCase(fetchBookingSourcesAsync.rejected, (state, action) => {
            state.bookingSources.loading = ILoadState.failed;
            state.bookingSources.error = action.error.message as string;
        });

        // Upsert Booking Source actions
        builder.addCase(upsertBookingSourceAsync.pending, (state) => {
            state.bookingSources.loading = ILoadState.pending;
        });
        builder.addCase(upsertBookingSourceAsync.fulfilled, (state, action) => {
            state.bookingSources.loading = ILoadState.succeeded;
            // Update or add the booking source in the list
            const existingIndex = state.bookingSources.data.findIndex(
                item => item.booking_source_uuid === action.payload.booking_source_uuid
            );
            if (existingIndex >= 0) {
                state.bookingSources.data[existingIndex] = action.payload;
            } else {
                state.bookingSources.data.push(action.payload);
                state.bookingSources.totalRecords += 1;
            }
            state.bookingSources.error = null;
        });
        builder.addCase(upsertBookingSourceAsync.rejected, (state, action) => {
            state.bookingSources.loading = ILoadState.failed;
            state.bookingSources.error = action.error.message as string;
        });

        // Delete Booking Source actions
        builder.addCase(deleteBookingSourceAsync.pending, (state) => {
            state.bookingSources.loading = ILoadState.pending;
        });
        builder.addCase(deleteBookingSourceAsync.fulfilled, (state, action) => {
            state.bookingSources.loading = ILoadState.succeeded;
            // Remove the booking source from the list
            state.bookingSources.data = state.bookingSources.data.filter(
                item => item.booking_source_uuid !== action.payload
            );
            state.bookingSources.totalRecords = Math.max(0, state.bookingSources.totalRecords - 1);
            state.bookingSources.error = null;
        });
        builder.addCase(deleteBookingSourceAsync.rejected, (state, action) => {
            state.bookingSources.loading = ILoadState.failed;
            state.bookingSources.error = action.error.message as string;
        });

        // Formula Calculator Logs actions
        builder.addCase(fetchFormulaCalculatorLogsAsync.pending, (state) => {
            state.calculatorLogs.loading = ILoadState.pending;
            state.calculatorLogs.data = [];
            state.calculatorLogs.totalRecords = 0;
        });
        builder.addCase(fetchFormulaCalculatorLogsAsync.fulfilled, (state, action) => {
            state.calculatorLogs.loading = ILoadState.succeeded;
            state.calculatorLogs.data = action.payload.data;
            state.calculatorLogs.totalRecords = action.payload.count;
            state.calculatorLogs.error = null;
        });
        builder.addCase(fetchFormulaCalculatorLogsAsync.rejected, (state, action) => {
            state.calculatorLogs.loading = ILoadState.failed;
            state.calculatorLogs.error = action.error.message as string;
        });
    }
});

export const { clearFormulaStateSync } = formulaSlice.actions;
export const formulaReducer = formulaSlice.reducer;

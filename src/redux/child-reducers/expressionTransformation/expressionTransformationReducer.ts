import { createSlice } from "@reduxjs/toolkit";
import { ILoadState } from "@/redux/store.enums";
import { initialExpressionTransformation } from "./expressionTransformation.types";
import {
    fetchInternalFunctionsAsync,
    fetchExpressionFunctionsAsync,
    fetchExpressionMappingsAsync,
    upsertExpressionFunctionsAsync,
    validateSingleFormulaAsync,
    fetchExternalVariablesAsync
} from "./expressionTransformationActions";

const expressionTransformationSlice = createSlice({
    name: "expressionTransformation",
    initialState: initialExpressionTransformation,
    reducers: {
        clearExpressionTransformationStateSync: (state) => {
            return initialExpressionTransformation;
        }
    },
    extraReducers: (builder) => {
        // Fetch Expression Functions
        builder.addCase(fetchExpressionFunctionsAsync.pending, (state) => {
            state.funsVars.loading = ILoadState.pending;
            state.funsVars.data = {};
            state.funsVars.error = null;
        });
        builder.addCase(fetchExpressionFunctionsAsync.fulfilled, (state, action) => {
            state.funsVars.loading = ILoadState.succeeded;
            state.funsVars.data = action.payload;
            state.funsVars.error = null;
        });
        builder.addCase(fetchExpressionFunctionsAsync.rejected, (state, action) => {
            state.funsVars.loading = ILoadState.failed;
            state.funsVars.error = action.error.message as string;
        });

        // Fetch External Variables
        builder.addCase(fetchExternalVariablesAsync.pending, (state) => {
            state.external_variables_list.loading = ILoadState.pending;
            state.external_variables_list.data = [];
            state.external_variables_list.error = null;
        });
        builder.addCase(fetchExternalVariablesAsync.fulfilled, (state, action) => {
            state.external_variables_list.loading = ILoadState.succeeded;
            state.external_variables_list.data = action.payload.data;
            state.external_variables_list.totalRecords = action.payload.count;
            state.external_variables_list.error = null;
        });
        builder.addCase(fetchExternalVariablesAsync.rejected, (state, action) => {
            state.external_variables_list.loading = ILoadState.failed;
            state.external_variables_list.error = action.error.message as string;
        });


        // Fetch Expression Mappings
        builder.addCase(fetchExpressionMappingsAsync.pending, (state) => {
            state.mappings.loading = ILoadState.pending;
            state.mappings.data = [];
        });
        builder.addCase(fetchExpressionMappingsAsync.fulfilled, (state, action) => {
            state.mappings.loading = ILoadState.succeeded;
            state.mappings.data = action.payload.data;
            state.selectedTableName = action.payload.selectedTable;
        });
        builder.addCase(fetchExpressionMappingsAsync.rejected, (state) => {
            state.mappings.loading = ILoadState.failed;
            state.mappings.data = [];
        });

        // Fetch Expression Columns
        builder.addCase(fetchInternalFunctionsAsync.pending, (state) => {
            state.externalFunctions.loading = ILoadState.pending;
            state.externalFunctions.data = {};
            state.externalFunctions.error = null;
        });
        builder.addCase(fetchInternalFunctionsAsync.fulfilled, (state, action) => {
            state.externalFunctions.loading = ILoadState.succeeded;
            state.externalFunctions.data = action.payload.data;
            state.externalFunctions.count = action.payload.count;
            state.externalFunctions.error = null;
        });
        builder.addCase(fetchInternalFunctionsAsync.rejected, (state, action) => {
            state.externalFunctions.loading = ILoadState.failed;
            state.externalFunctions.error = action.error.message as string;
        });

        // Upsert Expression Functions
        builder.addCase(upsertExpressionFunctionsAsync.pending, (state) => {
            state.funsVars.loading = ILoadState.pending;
        });
        builder.addCase(upsertExpressionFunctionsAsync.fulfilled, (state) => {
            state.funsVars.loading = ILoadState.succeeded;
        });
        builder.addCase(upsertExpressionFunctionsAsync.rejected, (state) => {
            state.funsVars.loading = ILoadState.failed;
        });

        // Validate Expression
        builder.addCase(validateSingleFormulaAsync.pending, (state) => {
            state.funsVars.loading = ILoadState.pending;
        });
        builder.addCase(validateSingleFormulaAsync.fulfilled, (state) => {
            state.funsVars.loading = ILoadState.succeeded;
        });
        builder.addCase(validateSingleFormulaAsync.rejected, (state) => {
            state.funsVars.loading = ILoadState.failed;
        });
    }
});

export const expressionTransformationReducer = expressionTransformationSlice.reducer;
export const { clearExpressionTransformationStateSync } = expressionTransformationSlice.actions;

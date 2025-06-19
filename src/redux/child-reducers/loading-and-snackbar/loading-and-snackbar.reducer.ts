import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { defaultLoadingAndSnackbarState } from "./loading-and-snackbar.state";
import { ILoadingAndSnackbarState } from "./loading-and-snackbar.types";

const loadingAndSnackbarSlice = createSlice({
    initialState: defaultLoadingAndSnackbarState,
    name: "loading-and-snackbar",
    reducers: {
        openSnackbarDialog: (state, action: PayloadAction<ILoadingAndSnackbarState["snackbar"]["content"]>) => {
            state.snackbar.visible = true
            state.snackbar.content.variant = action.payload.variant
            state.snackbar.content.message = action.payload.message
        },
        closeSnackbarDialog: (state) => {
            state.snackbar.visible = false
            state.snackbar = defaultLoadingAndSnackbarState["snackbar"]
        },
        openLoadingDialog: (state, action: PayloadAction<ILoadingAndSnackbarState["loading"]["message"]>) => {
            state.loading.visible = true
            state.loading.message = action.payload
        },
        closeLoadingDialog: (state) => {
            state.loading.visible = false
            state.loading.message = defaultLoadingAndSnackbarState["loading"]["message"]
        },
    },
});

export const loadingAndSnackbarReducer = loadingAndSnackbarSlice.reducer;
export const {
    openSnackbarDialog,
    closeSnackbarDialog,
    openLoadingDialog,
    closeLoadingDialog
} = loadingAndSnackbarSlice.actions;
import { createAction } from "@reduxjs/toolkit";

export const openLoadingDialog = createAction<string>("loading/openLoadingDialog");
export const closeLoadingDialog = createAction("loading/closeLoadingDialog");
export const openSnackbarDialog = createAction<{ variant: "success" | "error", message: string }>("loading/openSnackbarDialog"); 
import { ILoadingAndSnackbarState } from "./loading-and-snackbar.types";



export const defaultLoadingAndSnackbarState: ILoadingAndSnackbarState = {
    loading: {
        visible: false,
    },
    snackbar: {
        visible: false,
        content: {
            message: ""
        }
    }
}
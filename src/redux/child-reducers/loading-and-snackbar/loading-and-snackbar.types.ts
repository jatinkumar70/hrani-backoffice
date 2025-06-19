


export type ISnakbarContent = {
    variant?: any
    message: string
}


export interface ILoadingAndSnackbarState {
    loading: {
        visible: boolean,
        message?: string
    }
    snackbar: {
        visible: boolean,
        content: ISnakbarContent
    }
}
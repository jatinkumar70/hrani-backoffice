import { AsyncThunk, AsyncThunkOptions, createAsyncThunk, GetThunkAPI, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { closeLoadingDialog, openLoadingDialog, openSnackbarDialog } from "./loading-dialog.actions";
import { AppDispatch, RootState } from "./store";
import { axios_Loading_messages, consoleAxiosErrors } from "@/api/axios-base-api";


interface ICustomThunkApiConfig {
    state: RootState; // Your application's RootState type
    dispatch: ThunkDispatch<unknown, unknown, UnknownAction>; // Your application's AppDispatch type
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
}

//---------------------- [Get] createAsyncThunk Wrapper with Try Catch ------------------------//
export function createAsyncThunkGetWrapper<Returned, ThunkArg = void>(
    typePrefix: string,
    payloadCreator: (arg: ThunkArg, thunkAPI: GetThunkAPI<ICustomThunkApiConfig>) =>
        Promise<Returned> | Returned
) {
    return createAsyncThunk<Returned, ThunkArg, ICustomThunkApiConfig>(
        typePrefix,
        async (arg, thunkAPI) => {
            try {
                return await payloadCreator(arg, thunkAPI);

            } catch (error: any) {

                consoleAxiosErrors(error)
                thunkAPI.dispatch(openSnackbarDialog({ variant: "error", message: error.message }))
                return thunkAPI.rejectWithValue(error instanceof Error ? error.message : error);

            }
        }
    );
}

//---------------------- [POST] createAsyncThunk Wrapper with Try Catch ------------------------//

export const createAsyncThunkPostWrapper = <Returned, ThunkArg = void>(
    typePrefix: string,
    payloadCreator: (arg: ThunkArg, thunkAPI: GetThunkAPI<ICustomThunkApiConfig>) => Promise<Returned> | Returned
) => createAsyncThunk<Returned, ThunkArg, ICustomThunkApiConfig>(typePrefix, async (arg, thunkAPI) => {
    try {
        thunkAPI.dispatch(openLoadingDialog(axios_Loading_messages.save))
        return await payloadCreator(arg, thunkAPI);

    } catch (error: any) {
        console.log("createAsyncThunkPostWrapper error===>", error)
        consoleAxiosErrors(error)
        thunkAPI.dispatch(openSnackbarDialog({ variant: "error", message: error.message }))
        return thunkAPI.rejectWithValue(error instanceof Error ? error.message : error);

    } finally {
        thunkAPI.dispatch(closeLoadingDialog())
    }
});

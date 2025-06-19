import { ILoadState } from "@/redux/store.enums";
import { IGeneralState } from "./general.types";



export const defaultGeneralState: IGeneralState = {
    files_and_folders_list: {
        loading: ILoadState.idle,
        data: [],
        count: 0,
        error: null
    },
    record_count: {
        loading: ILoadState.idle,
        data: [],
        count: 0,
        error: null
    },
}
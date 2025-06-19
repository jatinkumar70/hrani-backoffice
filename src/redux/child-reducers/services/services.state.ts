import { ILoadState } from "@/redux/store.enums";
import { IService, IServiceState } from "./services.types";




export const defaultService: IService = {
    services_uuid: null,
    services_type: "",
    services_sub_type: "",
    country: "",
    questionnaire_name: "",
    questionnaire_uuid: "",
    status: "ACTIVE"
}


export const defaultServiceState: IServiceState = {
    services_list: {
        loading: ILoadState.idle,
        data: [],
        count: 0,
        error: null
    },
    single_service: {
        loading: ILoadState.idle,
        data: defaultService,
        error: null
    },
}
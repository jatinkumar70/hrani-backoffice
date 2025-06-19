import { ILoadState } from "@/redux/store.enums";






export interface IService {
    services_uuid: string | null,
    services_type: string,
    services_sub_type: string,
    country: string,
    questionnaire_name: string,
    questionnaire_uuid: string,
    status: "ACTIVE" | "INACTIVE"

    create_ts?: string
    insert_ts?: string
}


export interface IServiceState {
    services_list: {
        loading: ILoadState
        data: IService[]
        count: number;
        error: string | null;
    },
    single_service: {
        loading: ILoadState
        data: IService
        error: string | null;
    },
}
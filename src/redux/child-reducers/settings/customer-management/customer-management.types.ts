import { ILoadState } from "@/redux/store.enums";


export interface ICustomerAutomation {
    customer_automation_uuid: string | null,
    automation_type: "AUTOMATED" | "MANUAL",
    status: "ACTIVE" | "INACTIVE";
    create_ts?: string;
    insert_ts?: string;
}

export interface ICustomerAutomationState {
    single_automation: {
        loading: ILoadState;
        data: ICustomerAutomation;
        error: string | null;
    };
}

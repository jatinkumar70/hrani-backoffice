import { ILoadState } from "@/redux/store.enums";
import { ICustomerAutomation, ICustomerAutomationState } from "./customer-management.types";

export const defaultCustomerAutomation: ICustomerAutomation = {
    customer_automation_uuid: null,
    automation_type: "AUTOMATED",
    status: "ACTIVE",
};

export const defaultCustomerAutomationState: ICustomerAutomationState = {
    single_automation: {
        loading: ILoadState.idle,
        data: defaultCustomerAutomation,
        error: null,
    },
};
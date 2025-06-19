import { ILoadState } from "@/redux/store.enums";
import { IBranch, IBranchState } from "./branch.types";

export const defaultBranch: IBranch = {
    branch_uuid: null,
    branch_name: "",
    branch_code: "",
    branch_email: "",
    branch_logo: "",
    description: "",

    branch_phone_no: "",
    branch_mobile_no: "",

    branch_address_line1: null,
    branch_address_line2: null,
    branch_address_state: null,
    branch_address_city: null,
    branch_address_district: null,
    branch_address_pincode: null,
    branch_address_country: null,

    status: "ACTIVE"
}

export const defaultBranchState: IBranchState = {
    multiple_branches: {
        loading: ILoadState.idle,
        data: [],
        count: 0,
        error: null,
    },
    single_branch: {
        loading: ILoadState.idle,
        data: defaultBranch,
        error: null,
    },

}
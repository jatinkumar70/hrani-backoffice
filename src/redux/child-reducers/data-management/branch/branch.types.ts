import { ILoadState } from "@/redux/store.enums";

export interface IBranch {
    branch_uuid: string | null,
    branch_name: string,
    branch_code: string,
    branch_email: string,
    branch_logo: string,
    branch_phone_no: string,
    branch_mobile_no: string,
    description: string,

    branch_address_line1: string | null;
    branch_address_line2: string | null;
    branch_address_state: string | null;
    branch_address_city: string | null;
    branch_address_district: string | null;
    branch_address_pincode: string | null;
    branch_address_country: string | null;

    status: "ACTIVE" | "INACTIVE"

    create_ts?: string
    insert_ts?: string
}

export interface IBranchState {
    multiple_branches: {
        loading: ILoadState,
        data: IBranch[],
        count: number,
        error: string | null,
    },
    single_branch: {
        loading: ILoadState,
        data: IBranch,
        error: string | null,
    },
}
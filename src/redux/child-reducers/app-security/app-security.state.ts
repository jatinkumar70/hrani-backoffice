import { ILoadState } from "@/redux/store.enums";
import { IRole, ISecurityState } from "./app-security.types";

export const defaultRole: IRole = {
    role_id: 0,
    role_uuid: "",
    role_name: "",
    role_value: "",
    role_group: "",
    role_json: "",
    status: "",
}


export const defaultSecurityState: ISecurityState = {
    groups: {
        roleName: null,
        status: "ACTIVE",
        group: { modules: {} },
        role_group: "",
        loading: ILoadState.idle,
        error: null,
    },
    roles: {
        list: [],
        totalRecords: 0,
        loading: ILoadState.idle,
        error: null
    },
    approval: {
        list: [],
        loading: ILoadState.idle,
        approvalData: {
            approval_count_uuid: null,
            table_name: "",
            link_table: null,
            link_column: null,
            approval_hierarchy: [[{ type: "", uuid: "" }]],
            status: "ACTIVE",
            approval_raise_status: "",
            previous_status: "",
            next_status: "",
        },
        approvalLoading: ILoadState.idle,
        totalRecords: 0,
        error: null,
    },
    roleGroups: {
        list: [],
        totalRecords: 0,
        loading: ILoadState.idle,
        error: null
    },
};
import { ILoadState } from '@/redux/store.enums'
import { ISecurityRoleGroup } from './role-group/role-group.types'

export interface ISecurityApproval {
    approval_count_uuid: string | null
    table_name: string
    link_table: string | null
    link_column: string | null
    approval_hierarchy: { type: string; uuid: string }[][]
    status: 'ACTIVE' | 'INACTIVE'
    approval_raise_status: string
    previous_status: string
    next_status: string
    create_ts?: string
    level?: string
    insert_ts?: string
}

export interface IRole {
    role_id: number
    role_uuid: string
    role_name: string
    role_value: string
    role_group: string
    role_json: string
    status: string
}

export interface ISecurityGroup extends IRecordPremission {
    module_uuid: string
    module_name: string
    module_key: string
    submodule_name: string
    role_name: string
    role_id: number
    role_uuid: number
    show_module: number
    view_access: number
    edit_access: number
    bulk_import: number
    bulk_export: number
    send_sms: number
    send_mail: number
    send_whatsapp: number
    send_call: number
}

export interface IPremissions extends ISecurityGroup {
    view_access: number
    edit_access: number
    bulk_export: number
    bulk_import: number
    send_mail: number
    send_sms: number
    send_whatsapp: number
    send_call: number
}

export interface ISecurityNestedGroup {
    modules: {
        [key: string]: ISecurityGroupWithChildren
    }
}

export interface ISecurityGroupWithChildren {
    children: ISecurityGroup[]
}

export interface IRecordPremission {
    module_id: string
    role_id: number
    role_uuid: number
    submodule_name: string
    table_name: string
    column_relation_options: IRecordColumnRelation[]
    filter_values: IRecordFilterValue
    role_module_code?: string | null
}

export interface IRecordColumnRelation {
    api: string
    field: string
    value: string
    column_key: string
    column_label: string
}

export interface IRecordFilterValue {
    [key: string]: {
        [key: string]: any[]
    }
}

export interface ISecurityState {
    groups: {
        roleName: string | null
        status: string | null
        group: ISecurityNestedGroup
        role_group: string | null
        loading: ILoadState
        error: string | null
    }
    roles: {
        list: IRole[]
        totalRecords: number
        loading: ILoadState
        error: string | null
    }
    approval: {
        list: ISecurityApproval[]
        totalRecords: number
        loading: ILoadState
        approvalData: ISecurityApproval
        approvalLoading: ILoadState
        error: string | null
    }
    roleGroups: {
        list: ISecurityRoleGroup[]
        totalRecords: number
        loading: ILoadState
        error: string | null
    }
}

export interface ISearchSecurityRolesParams {
    pageNo: number
    itemPerPage: number
    value?: string
    columns?: string[]
    status?: string
    from_date?: string
    to_date?: string
}

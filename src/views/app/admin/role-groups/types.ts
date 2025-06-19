// src/views/admin/vouchers/types.ts
export type RoleGroup = {
    role_group_uuid: string
    role_group: string
    status: string
    create_ts: string
    insert_ts: string
    created_by_uuid: string
}

export type RoleGroups = RoleGroup[]

export type GetRoleGroupsResponse = {
    list: RoleGroup
    total: number
}

export interface IVoucherListState {
    data: RoleGroups
    count: number
    loading: boolean
    error: string | null
}

export interface ISearchRoleGroupParams {
    page: number
    rowsPerPage: number
    // searchValue?: string
    status?: string
    from_date?: string
    to_date?: string
}

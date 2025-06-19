// src/views/admin/vouchers/types.ts
export type Role = {
    role_id: number
    role_uuid: string
    role_name: string
    role_value: string
    role_group: string
    status: string
    role_json: string
}

export type Roles = Role[]

export type GetRolesResponse = {
    list: Role
    total: number
}

export interface IRoleListState {
    data: Roles
    count: number
    loading: boolean
    error: string | null
}

export interface ISearchRoleParams {
    page: number
    rowsPerPage: number
    // searchValue?: string
    status?: string
    from_date?: string
    to_date?: string
}

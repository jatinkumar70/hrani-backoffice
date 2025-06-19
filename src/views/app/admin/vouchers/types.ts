// src/views/admin/vouchers/types.ts
export type Voucher = {
    voucher_uuid: string
    voucher_code: string
    label: string
    discount_type: string
    amount: number
    max_limit: number
    status: string
    created_at: string
    updated_at: string
    description: string
}

export type Vouchers = Voucher[]

export type GetVouchersResponse = {
    list: Vouchers
    total: number
}

export interface IVoucherListState {
    data: Vouchers
    count: number
    loading: boolean
    error: string | null
}

export interface ISearchVoucherParams {
    pageNo: number
    itemPerPage: number
    // searchValue?: string
    status?: string
    from_date?: string
    to_date?: string
}

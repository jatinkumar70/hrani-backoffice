import { ILoadState } from '@/redux/store.enums'

export interface IVoucher {
    voucher_uuid: string
    voucher_code: string
    label: string
    discount_type: string
    amount: number
    max_limit?: number
    status: string
    created_at?: string
    updated_at?: string
    description: string
}

export interface IVoucherList {
    loading: ILoadState
    data: IVoucher[]
    count: number
    error: string | null
}

export interface IVoucherState {
    voucher_list: IVoucherList
    single_voucher: {
        loading: ILoadState
        data: IVoucher | null
        error: string | null
    }
}

export interface ISearchVoucherParams {
    pageNo: number
    itemPerPage: number
    value?: string
    columns?: string[]
    status?: string
    from_date?: string
    to_date?: string
    advanceFilter?: string
    searchValue?: string
}

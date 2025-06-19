import { ILoadState } from '@/redux/store.enums'

export interface IReferral {
    bni_clicks_uuid: string
    type: string
    referral: string | null
    ip: string
    status: string
    created_by_uuid: string | null
    created_by_name: string | null
    modified_by_uuid: string | null
    modified_by_name: string | null
    create_ts?: string
}

export interface IReferralList {
    loading: ILoadState
    data: IReferral[]
    count: number
    error: string | null
}

export interface IReferralState {
    referral_list: IReferralList
    single_referral: {
        loading: ILoadState
        data: IReferral | null
        error: string | null
    }
}

export interface ISearchReferralParams {
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

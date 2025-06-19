import { ILoadState } from '@/redux/store.enums'
import { IReferralState } from './referral.types'

export const defaultReferralState: IReferralState = {
    referral_list: {
        loading: ILoadState.idle,
        data: [],
        count: 0,
        error: null,
    },
    single_referral: {
        loading: ILoadState.idle,
        data: null,
        error: null,
    },
}

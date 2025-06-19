import { ILoadState } from '@/redux/store.enums'
import { IVoucherState } from './voucher.types'

export const defaultVoucherState: IVoucherState = {
    voucher_list: {
        loading: ILoadState.idle,
        data: [],
        count: 0,
        error: null,
    },
    single_voucher: {
        loading: ILoadState.idle,
        data: null,
        error: null,
    },
}

import { Routes } from '@/@types/routes'
import { vite_app_routes } from '@/router/vite-app-routes'
import { lazy } from 'react'

export const useReferralRoutes: Routes = [
    {
        key: 'admin.referral',
        path: vite_app_routes.app.admin.referral,
        component: lazy(() => import('./ReferralList')),
        authority: [],
        meta: {
            pageContainerType: 'contained',
        },
    },
    // {
    //     key: 'admin.vouchers.view',
    //     path: `${vite_app_routes.app.admin.vouchers}/view/:voucher_uaid`,
    //     component: lazy(() => import('./VoucherView')),
    //     authority: [],
    //     meta: {
    //         pageContainerType: 'contained',
    //     },
    // },
    {
        key: 'admin.referral.edit',
        path: `${vite_app_routes.app.admin.referral}/edit/:bni_clicks_uuid`,
        component: lazy(() => import('./SingleReferralForm')),
        authority: [],
        meta: {
            pageContainerType: 'contained',
        },
    },
    // {
    //     key: 'admin.vouchers.create',
    //     path: `${vite_app_routes.app.admin.vouchers}/create`,
    //     component: lazy(() => import('./components/NewVoucherForm')),
    //     authority: [],
    //     meta: {
    //         pageContainerType: 'contained',
    //     },
    // },
]

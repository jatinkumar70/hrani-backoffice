// src/views/admin/vouchers/Vouchers.router.ts
import { Routes } from '@/@types/routes'
import { vite_app_routes } from '@/router/vite-app-routes'
import { lazy } from 'react'

export const useVouchersRoutes: Routes = [
    {
        key: 'admin.vouchers',
        path: vite_app_routes.app.admin.vouchers,
        component: lazy(() => import('./VoucherList')),
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
        key: 'admin.vouchers.edit',
        path: `${vite_app_routes.app.admin.vouchers}/edit/:voucher_uuid`,
        component: lazy(() => import('./SingleUserForm')),
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

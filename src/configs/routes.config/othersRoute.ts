import { lazy } from 'react'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'
import { APP_BASE_ROUTE } from '@/router/vite-app-routes'

const othersRoute: Routes = [
    {
        key: 'accessDenied',
        path: `${APP_BASE_ROUTE["app"]}/access-denied`,
        component: lazy(() => import('@/views/others/AccessDenied')),
        authority: [ADMIN, USER],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    {
        key: 'landing',
        path: `${APP_BASE_ROUTE["app"]}/landing`,
        component: lazy(() => import('@/views/others/Landing')),
        authority: [ADMIN, USER],
        meta: {
            layout: 'blank',
            footer: false,
            pageContainerType: 'gutterless',
            pageBackgroundType: 'plain',
        },
    },
]

export default othersRoute

import { lazy } from 'react'
import { DASHBOARDS_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'
import { vite_app_routes } from '@/router/vite-app-routes'

const dashboardsRoute: Routes = [
    {
        key: 'dashboard.ecommerce',
        path: vite_app_routes.app.dashboard.ecommerce,
        component: lazy(() => import('@/views/dashboards/EcommerceDashboard')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'dashboard.project',
        path: vite_app_routes.app.dashboard.project,
        component: lazy(() => import('@/views/dashboards/ProjectDashboard')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'dashboard.marketing',
        path: vite_app_routes.app.dashboard.marketing,
        component: lazy(() => import('@/views/dashboards/MarketingDashboard')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'dashboard.analytic',
        path: vite_app_routes.app.dashboard.analytic,
        component: lazy(() => import('@/views/dashboards/AnalyticDashboard')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
            pageBackgroundType: 'plain',
        },
    },
]

export default dashboardsRoute

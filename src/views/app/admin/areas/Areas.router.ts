import { Routes } from '@/@types/routes'
import { vite_app_routes } from '@/router/vite-app-routes'
import { lazy } from 'react'

const areasRoutes: Routes = [
    {
        key: 'admin.areas',
        path: vite_app_routes.app.admin.areas,
        component: lazy(() => import('./areasListView')),
        authority: [],
        meta: {
            pageContainerType: 'contained',
        },
    },
]

export default areasRoutes 
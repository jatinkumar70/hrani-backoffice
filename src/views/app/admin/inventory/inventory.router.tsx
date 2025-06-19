import { Routes } from '@/@types/routes'
import { lazy } from 'react'
import { vite_app_routes } from '@/router/vite-app-routes'

export const InventoryRoutes: Routes = [
    {
        key: 'admin.inventory',
        path: vite_app_routes.app.admin.inventory,
        component: lazy(() => import('./InventoryList')),
        authority: [],
        meta: {
            pageContainerType: 'contained',
        },
    },
]

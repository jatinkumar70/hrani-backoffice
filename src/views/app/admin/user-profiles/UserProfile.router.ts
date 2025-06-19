import { Routes } from '@/@types/routes'
import { vite_app_routes } from '@/router/vite-app-routes'
import { lazy } from 'react'

export const useProfilesRoutes: Routes = [
    {
        key: 'admin.users',
        path: vite_app_routes.app.admin.users,
        component: lazy(() => import('./UserProfilesTable')),
        authority: [],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'admin.users.edit',
        path: `${vite_app_routes.app.admin.users}/edit/:uuid`,
        component: lazy(() => import('./SingleUserForm')),
        authority: [],
        meta: {
            pageContainerType: 'contained',
        },
    },
]

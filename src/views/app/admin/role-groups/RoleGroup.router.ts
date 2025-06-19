import { Routes } from '@/@types/routes'
import { vite_app_routes } from '@/router/vite-app-routes'
import { lazy } from 'react'

export const useRoleGroupsRoutes: Routes = [
    {
        key: 'admin.security.role_groups',
        path: vite_app_routes.app.admin.security.role_groups,
        component: lazy(() => import('./RoleGroupsList')),
        authority: [],
        meta: {
            pageContainerType: 'contained',
        },
    },
    // {
    //     key: 'admin.security.role_groups.edit',
    //     path: `${vite_app_routes.app.admin.security.role_groups}/edit/:uuid`,
    //     component: lazy(() => import('./RoleGroupsTable')),
    //     authority: [],
    //     meta: {
    //         pageContainerType: 'contained',
    //     },
    // },
]

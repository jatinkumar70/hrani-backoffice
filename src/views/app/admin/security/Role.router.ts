import { Routes } from '@/@types/routes'
import { vite_app_routes } from '@/router/vite-app-routes'
import { lazy } from 'react'

export const useRoleRoutes: Routes = [
    {
        key: 'admin.security.root',
        path: vite_app_routes.app.admin.security.root,
        component: lazy(() => import('./RoleList')),
        authority: [],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'admin.security.root.create',
        path: `${vite_app_routes.app.admin.security.root}/create`,
        component: lazy(() => import('./components/NewRoleForm')),
        authority: [],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'admin.security.root.edit',
        path: `${vite_app_routes.app.admin.security.root}/edit/:roleId`,
        component: lazy(() => import('./components/NewRoleForm')),
        authority: [],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'admin.security.root.duplicate',
        path: `${vite_app_routes.app.admin.security.root}/duplicate/:roleId`,
        component: lazy(() => import('./components/NewRoleForm')),
        authority: [],
        meta: {
            pageContainerType: 'contained',
        },
    },
]

import { Routes } from '@/@types/routes'
import { vite_app_routes } from '@/router/vite-app-routes'
import { lazy } from 'react'

export const EnquiryRoutes: Routes = [
    {
        key: 'admin.enquiry',
        path: vite_app_routes.app.admin.enquiry,
        component: lazy(() => import('./EnquiryList')),
        authority: [],
        meta: {
            pageContainerType: 'contained',
        },
    },

] 
import { Routes } from '@/@types/routes'
import { vite_app_routes } from '@/router/vite-app-routes'
import { lazy } from 'react'

export const BookingRoutes: Routes = [
    {
        key: 'admin.booking',
        path: vite_app_routes.app.admin.booking,
        component: lazy(() => import('./bookingListView')),
        authority: [],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'admin.booking.details',
        path: `${vite_app_routes.app.admin.booking}/:booking_uuid`,
        component: lazy(() => import('./bookingDetailsView')), // This will need to be created later
        authority: [],
        meta: {
            pageContainerType: 'contained',
        },
    },
] 
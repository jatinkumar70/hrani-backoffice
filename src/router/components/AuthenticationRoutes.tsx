import React from 'react'
import { vite_app_routes } from '../vite-app-routes'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthContext } from '@/contexts/auth-context/auth-context.context'
import Loading from '@/components/shared/Loading'

export const AuthenticationRoutes = () => {
    const { is_loggedIn } = useAuthContext()
    const location = useLocation()

    // If not logged in, show the auth routes
    if (!is_loggedIn) {
        return <Outlet />
    }

    // If logged in, redirect to the dashboard or the intended destination
    const from = location.state?.from?.pathname || vite_app_routes.app.dashboard.ecommerce
    return <Navigate to={from} replace state={{ from: location }} />
}
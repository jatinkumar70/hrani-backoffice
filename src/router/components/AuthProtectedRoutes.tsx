import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { vite_app_routes } from '../vite-app-routes'
import { useAuthContext } from '@/contexts'

export const AuthProtectedRoutes = () => {
    const { is_loggedIn } = useAuthContext()
    const location = useLocation()

    if (is_loggedIn) return <Outlet />
    return (
        <Navigate
            to={vite_app_routes.auth.sign_in}
            replace
            state={{ path: location.pathname }}
        />
    )
}

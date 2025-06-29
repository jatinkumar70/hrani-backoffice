import { lazy } from 'react'
import type { Routes } from '@/@types/routes'
import { vite_app_routes } from '@/router/vite-app-routes'

const authRoute: Routes = [
    {
        key: 'signIn',
        path: vite_app_routes.auth.sign_in,
        component: lazy(() => import('@/views/auth/SignIn')),
        authority: [],
    },
    {
        key: 'signUp',
        path: vite_app_routes.auth.sign_up,
        component: lazy(() => import('@/views/auth/SignUp')),
        authority: [],
    },
    // {
    //     key: 'forgotPassword',
    //     path: `/forgot-password`,
    //     component: lazy(() => import('@/views/auth/ForgotPassword')),
    //     authority: [],
    // },
    // {
    //     key: 'resetPassword',
    //     path: `/reset-password`,
    //     component: lazy(() => import('@/views/auth/ResetPassword')),
    //     authority: [],
    // },
    // {
    //     key: 'otpVerification',
    //     path: `/otp-verification`,
    //     component: lazy(() => import('@/views/auth/OtpVerification')),
    //     authority: [],
    // },
]

export default authRoute

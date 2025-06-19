import { Routes } from '@/@types/routes'
import { vite_app_routes } from '@/router/vite-app-routes'
import { lazy } from 'react'

export const FormulaRoutes: Routes = [
    {
        key: 'admin.formula_mapping',
        path: vite_app_routes.app.admin.formula_mapping,
        component: lazy(() => import('./FormulaMapping')),
        authority: [],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'admin.formula_calculator_logs',
        path: vite_app_routes.app.admin.formula_calculator_logs,
        component: lazy(() => import('./FormulaCalculatorLogs')),
        authority: [],
        meta: {
            pageContainerType: 'contained',
        },
    },
] 
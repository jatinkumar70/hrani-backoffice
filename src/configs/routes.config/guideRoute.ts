import { lazy } from 'react'
import { GUIDE_PREFIX_PATH } from '@/constants/route.constant'
import type { Routes } from '@/@types/routes'
import { APP_BASE_ROUTE } from '@/router/vite-app-routes'

const guideRoute: Routes = [
    {
        key: 'guide.documentation',
        path: `${APP_BASE_ROUTE["app"]}${GUIDE_PREFIX_PATH}/documentation/*`,
        component: lazy(() => import('@/views/guide/Documentations')),
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    {
        key: 'guide.sharedComponentDoc',
        path: `${APP_BASE_ROUTE["app"]}${GUIDE_PREFIX_PATH}/shared-component-doc/*`,
        component: lazy(() => import('@/views/guide/SharedComponentsDoc')),
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    {
        key: 'guide.utilsDoc',
        path: `${APP_BASE_ROUTE["app"]}${GUIDE_PREFIX_PATH}/utils-doc/*`,
        component: lazy(() => import('@/views/guide/UtilsDoc')),
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    {
        key: 'guide.changelog',
        path: `${APP_BASE_ROUTE["app"]}${GUIDE_PREFIX_PATH}/changelog`,
        component: lazy(() => import('@/views/guide/ChangeLog')),
        authority: [],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
]

export default guideRoute

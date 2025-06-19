import { Navigate, useRoutes, useLocation } from 'react-router-dom'
import PageContainer from '@/components/template/PageContainer'
import AppRoute from '@/components/route/AppRoute'
import AuthorityGuard from '@/components/route/AuthorityGuard'
import { LayoutType } from '@/@types/theme'
import { protectedRoutes } from '@/configs/routes.config'
import { authenticationRoutes } from '@/configs/routes.config/routes.config'
import { AuthenticationRoutes } from './components/AuthenticationRoutes'
import { AuthProtectedRoutes } from './components/AuthProtectedRoutes'
import { APP_BASE_ROUTE, vite_app_routes } from './vite-app-routes'
import { useAuthContext } from '@/contexts/auth-context/auth-context.context'
import Loading from '@/components/shared/Loading'

interface ViewsProps {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    layout?: LayoutType
}

type AllRoutesProps = ViewsProps

const ViteAppRouter = (props: AllRoutesProps) => {
    const { is_loggedIn } = useAuthContext()
    const location = useLocation()

    const routes = useRoutes([
        {
            path: APP_BASE_ROUTE.root,
            element: is_loggedIn ? (
                <Navigate
                    replace
                    to={vite_app_routes.app.dashboard.ecommerce}
                />
            ) : (
                <Navigate
                    replace
                    to={vite_app_routes.auth.sign_in}
                />
            ),
        },

        {
            path: APP_BASE_ROUTE.auth,
            element: <AuthenticationRoutes />,
            children: authenticationRoutes.map((route, index) => ({
                path: route.path,
                element: (
                    <AppRoute
                        routeKey={route.key}
                        component={route.component}
                        {...route.meta}
                    />
                ),
            })),
        },
        {
            path: APP_BASE_ROUTE.app,
            element: <AuthProtectedRoutes />,
            children: protectedRoutes.map((route, index) => ({
                path: route.path,
                element: (
                    <AuthorityGuard userAuthority={[]} authority={[]}>
                        <PageContainer {...props} {...route.meta}>
                            <AppRoute
                                routeKey={route.key}
                                component={route.component}
                                {...route.meta}
                            />
                        </PageContainer>
                    </AuthorityGuard>
                ),
            })),
        },
        { path: '*', element: <Navigate replace to="/" /> },
    ])

    return routes
}

export default ViteAppRouter
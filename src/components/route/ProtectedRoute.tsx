import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuthContext } from '@/contexts'

const { unAuthenticatedEntryPath } = appConfig

const ProtectedRoute = () => {
    const { is_loggedIn } = useAuthContext();
    const location = useLocation();

    const pathName = location.pathname

    const getPathName =   pathName === '/' ? '' : `?${REDIRECT_URL_KEY}=${pathName}`

    if (!is_loggedIn) return <Navigate  replace  to={`${unAuthenticatedEntryPath}${getPathName}`}  />
    return <Outlet />
}

export default ProtectedRoute

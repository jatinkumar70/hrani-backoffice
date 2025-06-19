import { Navigate, Outlet } from 'react-router'
import appConfig from '@/configs/app.config'
import { useAuth } from '@/auth'
import { useAuthContext } from '@/contexts'

const { authenticatedEntryPath } = appConfig

const PublicRoute = () => {
    const { is_loggedIn } = useAuthContext()

    return is_loggedIn ? <Navigate to={authenticatedEntryPath} /> : <Outlet />
}

export default PublicRoute

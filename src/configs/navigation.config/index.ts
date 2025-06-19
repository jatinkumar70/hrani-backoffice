import dashboardsNavigationConfig from './dashboards.navigation.config'
import uiComponentNavigationConfig from './ui-components.navigation.config'
import conceptsNavigationConfig from './concepts.navigation.config'
import authNavigationConfig from './auth.navigation.config'
import othersNavigationConfig from './others.navigation.config'
import guideNavigationConfig from './guide.navigation.config'
import type { NavigationTree } from '@/@types/navigation'
import adminNavigationConfig from './admin.navigation.config'
import { useSecureMenuList } from '@/security/useSecureMenuList'

const navigationConfig: NavigationTree[] = [
    ...dashboardsNavigationConfig,
    // ...conceptsNavigationConfig,
    // ...uiComponentNavigationConfig,
    ...adminNavigationConfig,
    // ...authNavigationConfig,
    // ...othersNavigationConfig,
    // ...guideNavigationConfig,
]

// const menuList = useSecureMenuList(navigationConfig)

export default navigationConfig

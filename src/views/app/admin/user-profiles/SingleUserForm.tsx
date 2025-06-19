import { Suspense, useEffect } from 'react'
import AdaptiveCard from '@/components/shared/AdaptiveCard'

import useResponsive from '@/utils/hooks/useResponsive'
import { useSettingsStore } from '@/views/concepts/accounts/Settings/store/settingsStore'
import UsersMenu from './components/UsersMenu'
import UserMobileMenu from './components/UserMobileMenu'
import UserProfile from './components/UserProfile'
import UserSecurity from './components/UserSecurity'

const SingleUserForm = () => {
    const { currentView, setCurrentView } = useSettingsStore()

    const { smaller, larger } = useResponsive()

    useEffect(() => {
        // Parse the query parameters
        const queryParams = new URLSearchParams(location.search)
        const tab = queryParams.get('tab')

        // Set the current view based on the tab parameter
        if (tab === 'profile' || tab === 'security') {
            setCurrentView(tab)
        } else {
            // Default to profile if no tab specified
            setCurrentView('profile')
        }
    }, [location.search, setCurrentView])

    return (
        <AdaptiveCard className="h-full">
            <div className="flex flex-auto h-full relative">
                {larger.lg && (
                    <div className="'w-[200px] xl:w-[280px] fixed top-30 left-40">
                        <UsersMenu />
                    </div>
                )}

                <div
                    className={`flex-1 ${larger.lg ? 'ltr:ml-[200px] xl:ltr:ml-[280px] rtl:mr-[200px] xl:rtl:mr-[280px]' : ''}`}
                >
                    {smaller.lg && (
                        <div className="mb-6">
                            <UserMobileMenu />
                        </div>
                    )}
                    <Suspense fallback={<></>}>
                        {currentView === 'profile' && <UserProfile />}
                        {currentView === 'security' && <UserSecurity />}
                    </Suspense>
                </div>
            </div>
        </AdaptiveCard>
    )
}

export default SingleUserForm

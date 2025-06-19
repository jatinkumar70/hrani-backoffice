import { useRef } from 'react'
import ToggleDrawer from '@/components/shared/ToggleDrawer'
import type { ToggleDrawerRef } from '@/components/shared/ToggleDrawer'
import UsersMenu from './UsersMenu'

const UserMobileMenu = () => {
    const drawerRef = useRef<ToggleDrawerRef>(null)

    return (
        <>
            <div>
                <ToggleDrawer ref={drawerRef} title="Navigation">
                    <UsersMenu
                        onChange={() => {
                            drawerRef.current?.handleCloseDrawer()
                        }}
                    />
                </ToggleDrawer>
            </div>
        </>
    )
}

export default UserMobileMenu

import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import { useAuthContext } from '@/contexts/auth-context'
import { Link } from 'react-router'
import {
    PiUserDuotone,
    PiGearDuotone,
    PiPulseDuotone,
    PiSignOutDuotone,
} from 'react-icons/pi'
import type { JSX } from 'react'

type DropdownList = {
    label: string
    path: string
    icon: JSX.Element
}

const _UserDropdown = () => {
    const { user_info, user_full_name } = useAuthContext()

    const dropdownItemList: DropdownList[] = [
        {
            label: 'Profile',
            path: `/app/users/edit/${user_info?.user_uuid}?tab=profile`,
            icon: <PiUserDuotone />,
        },
        {
            label: 'Account Setting',
            path: `/app/users/edit/${user_info?.user_uuid}?tab=security`,
            icon: <PiGearDuotone />,
        },
        //     // {
        //     //     label: 'Activity Log',
        //     //     path: '/concepts/account/activity-log',
        //     //     icon: <PiPulseDuotone />,
        //     // },
    ]

    const handleSignOut = () => {
        // Clear session and redirect to login
        localStorage.removeItem('auth_user')
        sessionStorage.removeItem('jwt_access_token')
        window.location.href = '/sign-in'
    }

    const avatarProps = {
        // icon: <PiUserDuotone />,
        name: `${user_info?.first_name} ${user_info?.last_name || ''}`.trim(),
    }

    return (
        <Dropdown
            className="flex"
            toggleClassName="flex items-center"
            renderTitle={
                <div className="cursor-pointer flex items-center">
                    <Avatar size={32} {...avatarProps} />
                </div>
            }
            placement="bottom-end"
        >
            <Dropdown.Item variant="header">
                <div className="py-2 px-3 flex items-center gap-3">
                    <Avatar {...avatarProps} />
                    <div>
                        <div className="font-bold text-gray-900 dark:text-gray-100">
                            {user_full_name || 'Anonymous'}
                        </div>
                        <div className="text-xs">
                            {user_info?.email || 'No email available'}
                        </div>
                    </div>
                </div>
            </Dropdown.Item>
            <Dropdown.Item variant="divider" />
            {dropdownItemList.map((item) => (
                <Dropdown.Item
                    key={item.label}
                    eventKey={item.label}
                    className="px-0"
                >
                    <Link className="flex h-full w-full px-2" to={item.path}>
                        <span className="flex gap-2 items-center w-full">
                            <span className="text-xl">{item.icon}</span>
                            <span>{item.label}</span>
                        </span>
                    </Link>
                </Dropdown.Item>
            ))}
            <Dropdown.Item variant="divider" />
            <Dropdown.Item
                eventKey="Sign Out"
                className="gap-2"
                onClick={handleSignOut}
            >
                <span className="text-xl">
                    <PiSignOutDuotone />
                </span>
                <span>Sign Out</span>
            </Dropdown.Item>
        </Dropdown>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown

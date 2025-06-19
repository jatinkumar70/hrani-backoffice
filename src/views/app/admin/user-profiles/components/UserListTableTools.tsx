import DebouceInput from '@/components/shared/DebouceInput'
import { TbSearch } from 'react-icons/tb'
import type { ChangeEvent } from 'react'
import { fetchMultipleUsersWithArgsAsync, useAppDispatch } from '@/redux'

const UserListTableTools = () => {
    const dispatch = useAppDispatch()

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value
        if (typeof val === 'string' && val.length > 1) {
            dispatch(
                fetchMultipleUsersWithArgsAsync({
                    page: 1,
                    rowsPerPage: 10,
                    searchValue: val,
                    columns: [
                        'first_name',
                        'last_name',
                        'status',
                        'role_value',
                    ],
                }),
            )
        }

        if (typeof val === 'string' && val.length === 0) {
            dispatch(
                fetchMultipleUsersWithArgsAsync({
                    page: 1,
                    rowsPerPage: 10,
                    // value: '',
                    // columns: 'voucher_code',
                }),
            )
        }
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center gap-2">
            <DebouceInput
                placeholder="Search users..."
                suffix={<TbSearch className="text-lg" />}
                onChange={handleInputChange}
            />
        </div>
    )
}

export default UserListTableTools

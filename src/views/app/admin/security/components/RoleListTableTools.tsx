import DebouceInput from '@/components/shared/DebouceInput'
import { TbSearch } from 'react-icons/tb'
import type { ChangeEvent } from 'react'
import { fetchMultipleSecurityRolesAsync, useAppDispatch } from '@/redux'

const RoleListTableTools = () => {
    const dispatch = useAppDispatch()

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value
        if (typeof val === 'string' && val.length > 1) {
            dispatch(
                fetchMultipleSecurityRolesAsync({
                    page: 1,
                    rowsPerPage: 10,
                    value: val,
                    columns: 'role_name,role_group,status',
                }),
            )
        }

        if (typeof val === 'string' && val.length === 0) {
            dispatch(
                fetchMultipleSecurityRolesAsync({
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
                placeholder="Search security roles..."
                suffix={<TbSearch className="text-lg" />}
                onChange={handleInputChange}
            />
        </div>
    )
}

export default RoleListTableTools

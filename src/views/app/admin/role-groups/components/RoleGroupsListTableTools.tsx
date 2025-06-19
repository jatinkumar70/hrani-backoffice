import DebouceInput from '@/components/shared/DebouceInput'
import { TbSearch } from 'react-icons/tb'
import type { ChangeEvent } from 'react'
import { fetchSecurityRoleGroupListAsync, useAppDispatch } from '@/redux'

const RoleGroupsListTableTools = () => {
    const dispatch = useAppDispatch()

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value
        if (typeof val === 'string' && val.length > 1) {
            dispatch(
                fetchSecurityRoleGroupListAsync({
                    page: 1,
                    rowsPerPage: 10,
                    // value: val,
                    // columns:
                    //     'voucher_code,label,discount_type,amount,max_limit,status',
                }),
            )
        }

        if (typeof val === 'string' && val.length === 0) {
            dispatch(
                fetchSecurityRoleGroupListAsync({
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
                placeholder="Search role groups..."
                suffix={<TbSearch className="text-lg" />}
                onChange={handleInputChange}
            />
        </div>
    )
}

export default RoleGroupsListTableTools

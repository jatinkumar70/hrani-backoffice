import Button from '@/components/ui/Button'
import { TbCloudDownload, TbPlus } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import { vite_app_routes } from '@/router/vite-app-routes'
import { CSVLink } from 'react-csv'
import { useAppSelector } from '@/redux'
import moment from 'moment'
import { Dialog } from '@/components/ui'
import { useState } from 'react'
import NewRoleGroupForm from './NewRoleGroupForm'

const RoleGroupsListActionTools = () => {
    const navigate = useNavigate()
    const { data } = useAppSelector(
        (state) => state.management.security.roleGroups,
    )

    const [dialogOpen, setDialogOpen] = useState(false)

    // Provide fallback empty array if data is undefined
    // const csvData = (data || []).map((voucher) => ({
    //     'Voucher Code': voucher.voucher_code,
    //     Label: voucher.label,
    //     'Discount Type': voucher.discount_type,
    //     Amount: voucher.amount,
    //     'Max Limit': voucher.max_limit,
    //     Status: voucher.status,
    //     'Created At': moment(voucher.created_at).format('MMMM D, YYYY hh:mm A'),
    // }))

    return (
        <div className="flex flex-col md:flex-row gap-3">
            {/* <CSVLink
                data={csvData}
                filename="vouchers.csv"
                className="w-full"
                asyncOnClick={true}
            >
                <Button
                    icon={<TbCloudDownload className="text-xl" />}
                    className="w-full"
                    disabled={!data || data.length === 0}
                >
                    Download
                </Button>
            </CSVLink> */}
            <Button
                variant="solid"
                icon={<TbPlus className="text-xl" />}
                onClick={() => setDialogOpen(true)}
            >
                Create Role Group
            </Button>

            <Dialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)}>
                <h4>Add New Role Group</h4>
                <div className="mt-4">
                    <NewRoleGroupForm
                        isUpdate={false}
                        onClose={() => setDialogOpen(false)}
                    />
                </div>
            </Dialog>
        </div>
    )
}

export default RoleGroupsListActionTools

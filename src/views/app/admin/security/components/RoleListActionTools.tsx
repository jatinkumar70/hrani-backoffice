import Button from '@/components/ui/Button'
import { TbPlus } from 'react-icons/tb'
import { Link } from 'react-router'
import { vite_app_routes } from '@/router/vite-app-routes'

const RoleListActionTools = () => {
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
            <Link to={`${vite_app_routes.app.admin.security.root}/create`}>
                <Button
                    className="w-full"
                    variant="solid"
                    icon={<TbPlus className="text-xl" />}
                >
                    Create Security Role
                </Button>
            </Link>
        </div>
    )
}

export default RoleListActionTools

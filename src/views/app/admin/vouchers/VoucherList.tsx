// src/views/admin/vouchers/VoucherList.tsx
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import VoucherListActionTools from './components/VoucherListActionTools'
import VoucherListTableTools from './components/VoucherListTableTools'
import VoucherListTable from './components/VoucherListTable'

const VoucherList = () => {
    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4 p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        {/* <h3>Promo Codes</h3> */}
                        {/* <VoucherListActionTools  /> */}
                    </div>
                    {/* <VoucherListTableTools /> */}
                    <VoucherListTable />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default VoucherList

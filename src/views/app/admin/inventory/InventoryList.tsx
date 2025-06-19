// src/views/admin/vouchers/VoucherList.tsx
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import InventoryListActionTools from './components/InventoryListActionTools'
import InventoryListTableTools from './components/InventoryListTableTools'
import InventoryListTable from './components/InventoryListTable'

const InventoryList = () => {
    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4 p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3>Inventory Management</h3>
                        <InventoryListActionTools />
                    </div>

                    {/* <InventoryListTableTools /> */}
                    <InventoryListTable />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default InventoryList

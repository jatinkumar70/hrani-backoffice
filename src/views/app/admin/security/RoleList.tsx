// src/views/admin/vouchers/VoucherList.tsx
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import RoleListActionTools from './components/RoleListActionTools'
import RoleListTableTools from './components/RoleListTableTools'
import RoleListTable from './components/RoleListTable'

const RoleList = () => {
    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4 p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3>Security Roles</h3>
                        <RoleListActionTools />
                    </div>
                    <RoleListTableTools />
                    <RoleListTable />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default RoleList

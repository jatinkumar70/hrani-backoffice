// src/views/admin/vouchers/VoucherList.tsx
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import RoleGroupsListActionTools from './components/RoleGroupsListActionTools'
import RoleGroupsListTableTools from './components/RoleGroupsListTableTools'
import RoleGroupsListTable from './components/RoleGroupsListTable'

const RoleGroupsList = () => {
    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4 p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3>Role Groups</h3>
                        <RoleGroupsListActionTools />
                    </div>
                    <RoleGroupsListTableTools />
                    <RoleGroupsListTable />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default RoleGroupsList

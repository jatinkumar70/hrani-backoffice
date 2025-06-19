import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import ReferralListTable from './components/ReferralListTable'

const ReferralList = () => {
    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4 p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        {/* <h3>Referrals</h3> */}
                    </div>
                    <ReferralListTable />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default ReferralList

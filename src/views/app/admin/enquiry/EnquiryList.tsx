import { Card } from '@/components/ui'
import EnquiryListTable from './components/EnquiryListTable'

const EnquiryList = () => {
    return (
        <div>
            <Card className="p-4">
                <EnquiryListTable />
            </Card>
        </div>
    )
}

export default EnquiryList

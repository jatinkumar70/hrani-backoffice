import { useState, useEffect } from 'react'
import type { TableQueries } from '@/@types/common'
import axios_base_api from '@/api/axios-base-api'
import { server_base_endpoints } from '@/api'

interface EnquiryRequest {
    enquiry_request_uuid: string
    name: string
    email: string
    phone: string
    property_location: string
    status: string
    insert_ts: string
}

interface EnquiryResponse {
    data: EnquiryRequest[]
    totalRecords: number
}

interface Filter {
    column: string[]
    operator: string
    value: string
    logicalOperator: string
}

const useEnquiryList = (advancedFilters: Filter[] = []) => {
    const [enquiryList, setEnquiryList] = useState<EnquiryRequest[]>([])
    const [enquiryListTotal, setEnquiryListTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [tableData, setTableData] = useState<TableQueries>({
        pageIndex: 1,
        pageSize: 50,
        sort: {
            order: '',
            key: '',
        },
        query: '',
    })

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const params: Record<string, any> = {
                    pageNo: tableData.pageIndex,
                    itemPerPage: tableData.pageSize,
                    pageLimit: tableData.pageSize,
                }

                if (tableData.query) {
                    params.value = tableData.query
                    params.columns = JSON.stringify([
                        'name',
                        'email',
                        'phone',
                        'property_location',
                        'status',
                        'insert_ts',
                    ])
                    params.operator = 'CONTAINS'
                }

                if (advancedFilters.length > 0) {
                    const formattedFilters = advancedFilters.map((filter) => ({
                        column: filter.column,
                        operator: filter.operator,
                        value: filter.value,
                        logicalOperator: filter.logicalOperator,
                    }))

                    params.advanceFilter = JSON.stringify(
                        advancedFilters.length > 1
                            ? formattedFilters
                            : formattedFilters[0],
                    )
                }

                const response = await axios_base_api.get<EnquiryResponse>(
                    server_base_endpoints.data_management.get_enquiry,
                    { params },
                )

                if (response.data) {
                    setEnquiryList(response.data.data || [])
                    setEnquiryListTotal(response.data.totalRecords || 0)
                }
            } catch (error) {
                console.error('Error fetching enquiry data:', error)
                setEnquiryList([])
                setEnquiryListTotal(0)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [
        tableData.pageIndex,
        tableData.pageSize,
        tableData.query,
        advancedFilters,
    ])

    return {
        enquiryList,
        enquiryListTotal,
        isLoading,
        tableData,
        setTableData,
    }
}

export default useEnquiryList

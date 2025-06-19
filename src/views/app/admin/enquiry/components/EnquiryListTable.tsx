import { useMemo, useState, useCallback, useEffect } from 'react'
import Tag from '@/components/ui/Tag'
import DataTable from '@/components/shared/DataTable'
import useEnquiryList from '../hooks/useEnquiryList'
import cloneDeep from 'lodash/cloneDeep'
import type { OnSortParam, ColumnDef } from '@/components/shared/DataTable'
import type { TableQueries } from '@/@types/common'
import EnquiryListTableTools from './EnquiryListTableTools'
import { Drawer, Tooltip } from '@/components/ui'
import { TbEdit, TbEye, TbPencil, TbTrash } from 'react-icons/tb'
import { Calendar, Home, MapPin, Phone, User, CheckCircle, XCircle, BarChart3 } from 'lucide-react'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router'
import { vite_app_routes } from '@/router/vite-app-routes'
import moment from 'moment'
import EnquiryListActionTools from './EnquiryListActionTools'
import ListActionTools from '@/components/filters/ListActionTools'
import {
    columnOptions,
    logicalOperatorOptions,
    operatorOptions,
    quickSearchFields,
    statusOptions,
} from './Constants'
import axios_base_api from '@/api/axios-base-api'

const statusColor: Record<
    string,
    {
        label: string
        bgClass: string
        textClass: string
    }
> = {
    ACTIVE: {
        label: 'Active',
        bgClass: 'bg-success-subtle',
        textClass: 'text-success',
    },
    INACTIVE: {
        label: 'Inactive',
        bgClass: 'bg-warning-subtle',
        textClass: 'text-warning',
    },
    PENDING: {
        label: 'Pending',
        bgClass: 'bg-info-subtle',
        textClass: 'text-info',
    },
}

const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'confirmed':
        case 'success':
            return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
        case 'pending':
        case 'inquiry':
            return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'
        case 'cancelled':
            return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
        case 'completed':
            return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300'
        default:
            return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
    }
}

interface EnquiryRequest {
    enquiry_request_uuid: string
    name: string
    email: string
    phone: string
    property_location: string
    status: string
    insert_ts: string
}
interface Filter {
    column: string[]
    operator: string
    value: string
    logicalOperator: string
}

// Types
interface StatusCount {
    status: string
    count: number
}

const EnquiryListTable = () => {
    const navigate = useNavigate()

    const [selectedEnquiry, setSelectedEnquiry] =
        useState<EnquiryRequest | null>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [advancedFilters, setAdvancedFilters] = useState<any[]>([])
    const [isFilterActive, setIsFilterActive] = useState(false)
    const [enquires, setEnquires] = useState<EnquiryRequest[]>([])

    const {
        enquiryList = [],
        enquiryListTotal = 0,
        tableData,
        isLoading,
        setTableData,
    } = useEnquiryList(advancedFilters)

    // Calculate status counts from enquiryList data
    const statusCounts = useMemo(() => {
        const counts: { [key: string]: number } = {}
        
        enquiryList.forEach((enquiry) => {
            const status = enquiry.status || 'unknown'
            counts[status] = (counts[status] || 0) + 1
        })

        return Object.entries(counts).map(([status, count]) => ({
            status,
            count,
        }))
    }, [enquiryList])

    const handleRowClick = (enquiryUuid: string) => {
        navigate(`${vite_app_routes.app.admin.enquiry}/edit/${enquiryUuid}`)
    }

    const handleDeleteClick = (enquiry: EnquiryRequest) => {
        // Implement your delete logic here
        console.log('Delete enquiry:', enquiry.enquiry_request_uuid)
        // You might want to show a confirmation dialog before deleting
    }
    const handleView = (enquiryRequest: EnquiryRequest) => {
        setSelectedEnquiry(enquiryRequest)
        setIsDrawerOpen(true)
    }

    const handleDrawerClose = () => {
        setIsDrawerOpen(false)
        setSelectedEnquiry(null)
    }

    const handleSetTableData = (data: TableQueries) => {
        setTableData(data)
    }

    const handlePaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        handleSetTableData(newTableData)
    }

    const handleSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        handleSetTableData(newTableData)
    }

    const handleSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        handleSetTableData(newTableData)
    }

    const sortByInsertTsDesc = (data: EnquiryRequest[]) => {
        return data.sort(
            (a, b) =>
                new Date(b.insert_ts).getTime() -
                new Date(a.insert_ts).getTime(),
        )
    }

    const handleAdvancedSearch = (filters: any[]) => {
        const formattedFilters = filters.map((filter) => ({
            column: [filter.column],
            operator: filter.operator,
            value: filter.value,
            logicalOperator: filter.logicalOperator,
        }))

        setAdvancedFilters(formattedFilters)
        setIsFilterActive(filters.length > 0)
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = 1
        setTableData(newTableData)
    }

    const handleQuickSearch = (searchValues: Record<string, string>) => {
        const activeFilters = Object.entries(searchValues)
            .filter(([_, value]) => value.trim() !== '')
            .map(([column, value]) => ({
                column: [column],
                operator: 'CONTAINS',
                value,
                logicalOperator: 'AND',
            }))

        setAdvancedFilters(activeFilters)
        setIsFilterActive(activeFilters.length > 0)
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = 1
        setTableData(newTableData)
    }

    const handleResetFilters = () => {
        setAdvancedFilters([])
        setIsFilterActive(false)
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = 1
        setTableData(newTableData)
    }

    const columns: ColumnDef<any>[] = useMemo(
        () => [
            {
                header: 'action',
                id: 'action',
                cell: (props) => (
                    <div className="flex justify-start text-lg gap-1 font-bold heading-text">
                        <Tooltip wrapperClass="flex" title="View">
                            <span
                                className={`cursor-pointer p-2`}
                                onClick={() => handleView(props.row.original)}
                            >
                                <TbEye />
                            </span>
                        </Tooltip>
                        {/* <Tooltip wrapperClass="flex" title="Edit">
                            <span
                                className={`cursor-pointer p-2`}
                                onClick={() =>
                                    handleRowClick(props.row.original)
                                }
                            >
                                <TbPencil />
                            </span>
                        </Tooltip> */}
                        {/* <Tooltip wrapperClass="flex" title="Delete">
                                      <span
                                          className="cursor-pointer p-2 hover:text-red-500"
                                          onClick={() => handleDelete(props.row.original)}
                                      >
                                          <TbTrash />
                                      </span>
                                  </Tooltip> */}
                    </div>
                ),
            },
            // {
            //     header: 'Status',
            //     accessorKey: 'status',
            //     cell: (props) => {
            //         const { status } = props.row.original
            //         return (
            //             <Tag
            //                 className={
            //                     statusColor[status]?.bgClass || 'bg-gray-100'
            //                 }
            //             >
            //                 <span
            //                     className={`capitalize font-semibold ${
            //                         statusColor[status]?.textClass ||
            //                         'text-gray-600'
            //                     }`}
            //                 >
            //                     {statusColor[status]?.label || status}
            //                 </span>
            //             </Tag>
            //         )
            //     },
            // },
            {
                header: 'Enquiry Date',
                accessorKey: 'insert_ts',
                cell: (props) => {
                    const row = props.row.original

                    return (
                        <div className="flex flex-col">
                            <span className="font-bold heading-text">
                                {moment(row.insert_ts).format('MMMM, D YYYY')}
                            </span>
                            <small>
                                {moment(row.insert_ts).format('hh:mm A')}
                            </small>
                        </div>
                    )
                },
            },
            {
                header: 'Property Location',
                accessorKey: 'property_location',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="font-bold heading-text">
                            {row.property_location}
                        </span>
                    )
                },
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="font-bold heading-text">
                            {row.name}
                        </span>
                    )
                },
            },
            {
                header: 'Phone',
                accessorKey: 'phone',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="font-semibold">{row.phone}</span>
                },
            },
            {
                header: 'Email',
                accessorKey: 'email',
                cell: (props) => {
                    const row = props.row.original
                    return <span className="font-semibold">{row.email}</span>
                },
            },

            {
                header: 'Referral Code',
                accessorKey: 'referralCode',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="font-semibold">
                            {row.referralCode}
                        </span>
                    )
                },
            },
        ],
        [],
    )

    // Status Dashboard Component
    const StatusDashboard = () => {
        const getStatusIcon = (status: string) => {
            switch (status.toLowerCase()) {
                case 'active':
                    return <CheckCircle className="w-5 h-5 text-green-600" />
                case 'inactive':
                    return <XCircle className="w-5 h-5 text-red-600" />
                default:
                    return <BarChart3 className="w-5 h-5 text-gray-600" />
            }
        }

        const getStatusColor = (status: string) => {
            switch (status.toLowerCase()) {
                case 'active':
                    return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30'
                case 'inactive':
                    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30'
                default:
                    return 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
            }
        }

        const totalDisplayedCount = statusCounts.reduce((sum, item) => sum + item.count, 0)

        if (isLoading) {
            return (
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Status Distribution
                        </h3>
                        <div className="animate-pulse">
                            <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-20"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-200 dark:bg-gray-700 rounded-md p-3 h-16"></div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }

        return (
            <div className="mb-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status Distribution
                    </h3>
                    <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {enquiryListTotal?.toLocaleString()} Total
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {totalDisplayedCount.toLocaleString()} Displayed
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {statusCounts.map((item) => (
                        <div
                            key={item.status}
                            className={`
                                ${getStatusColor(item.status)}
                                p-3 rounded-md border transition-all duration-200 
                                hover:shadow-sm cursor-pointer
                            `}
                            onClick={() => {
                                // Filter by status when clicked
                                const statusFilter = [{
                                    column: ['status'],
                                    operator: 'EQUAL',
                                    value: item.status,
                                    logicalOperator: 'AND',
                                }]
                                setAdvancedFilters(statusFilter)
                                setIsFilterActive(true)
                                const newTableData = cloneDeep(tableData)
                                newTableData.pageIndex = 1
                                setTableData(newTableData)
                            }}
                        >
                            <div className="flex items-center justify-between mb-1">
                                {getStatusIcon(item.status)}
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    {item.status}
                                </span>
                            </div>
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {item.count.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {totalDisplayedCount > 0 ? ((item.count / totalDisplayedCount) * 100).toFixed(1) : 0}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <>
            <ListActionTools
                title="List Your Property Leads"
                advancedFilterConfig={{
                    columnOptions,
                    operatorOptions,
                    logicalOperatorOptions,
                    selectOptions: {
                        status: statusOptions,
                    },
                }}
                quickSearchFields={quickSearchFields}
                isFilterActive={isFilterActive}
                onAdvancedSearch={handleAdvancedSearch}
                onQuickSearch={handleQuickSearch}
                onResetFilters={handleResetFilters}
            />

            {/* Status Dashboard */}
            <StatusDashboard />

            <DataTable
                columns={columns}
                data={sortByInsertTsDesc(enquiryList)}
                noData={!isLoading && enquiryList.length === 0}
                loading={isLoading}
                pagingData={{
                    total: enquiryListTotal,
                    pageIndex: tableData.pageIndex as number,
                    pageSize: tableData.pageSize as number,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
            />

            <Drawer
                title="Property Leads Details"
                width={500}
                isOpen={isDrawerOpen}
                onClose={handleDrawerClose}
                onRequestClose={handleDrawerClose}
            >
                {selectedEnquiry && (
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-gray-800 pb-4">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    Property Leads Details
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                                    #
                                    {selectedEnquiry.enquiry_request_uuid ||
                                        '-'}
                                </p>
                            </div>
                            <div
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedEnquiry.status)}`}
                            >
                                {selectedEnquiry.status || '-'}
                            </div>
                        </div>

                        {/* Guest Information */}
                        <div className="mb-6">
                            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
                                Guest Information
                            </h2>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <User className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Guest Name
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedEnquiry.name || '-'}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Contact Number
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedEnquiry.phone || '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Stay Details */}
                        <div className="mb-6">
                            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
                                Stay Details
                            </h2>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Property Location
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedEnquiry.property_location ||
                                            '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Reservation Period */}
                        <div className="mb-6">
                            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
                                Reservation Period
                            </h2>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Enquiry Date
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedEnquiry.insert_ts
                                            ? dayjs(
                                                  selectedEnquiry.insert_ts,
                                              ).format('DD MMM YYYY')
                                            : '-'}
                                    </p>
                                </div>
                                {/* <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">Check-out</p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedEnquiry.to_date ? dayjs(selectedEnquiry.to_date).format("DD MMM YYYY") : "-"}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">Duration</p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {dayjs(selectedEnquiry.to_date).diff(dayjs(selectedEnquiry.from_date), "day")} nights
                                    </p>
                                </div> */}
                            </div>
                        </div>

                        {/* Payment Information */}
                        {/* <div>
                            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">Payment Information</h2>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">Payment Status</p>
                                    </div>
                                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedEnquiry.payment_status)}`}>
                                        {selectedEnquiry.payment_status || "-"}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Package className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">Package Type</p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedEnquiry.is_refundable === null ? "Non-Refundable" : selectedEnquiry.is_refundable || "-"}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <p className="font-medium text-gray-900 dark:text-gray-100">Total Amount</p>
                                    <p className="font-bold text-gray-900 dark:text-gray-100">
                                        {selectedEnquiry.currency || ""}
                                        {selectedEnquiry.total_price ? selectedEnquiry.total_price.toLocaleString() : "-"}
                                    </p>
                                </div>
                            </div>
                        </div> */}
                    </div>
                )}
            </Drawer>
        </>
    )
}

export default EnquiryListTable

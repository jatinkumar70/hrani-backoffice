/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'

import ListActionTools from '@/components/filters/ListActionTools'
import type { ColumnDef, OnSortParam } from '@/components/shared/DataTable'
import DataTable from '@/components/shared/DataTable'
import { Notification, toast } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Drawer from '@/components/ui/Drawer'
import Tooltip from '@/components/ui/Tooltip'
import {
    getPropertyEditUrl,
    getPropertyPublicUrl,
    insertPropertyWithPmsAsync,
} from '@/redux/child-reducers/property'
import cloneDeep from 'lodash/cloneDeep'
import {
    Bath,
    BedDouble,
    Building2,
    ExternalLink,
    Eye,
    Globe,
    Home,
    Mail,
    MapPin,
    Phone,
    Star,
    User,
    Users,
    CheckCircle,
    XCircle,
    BarChart3,
} from 'lucide-react'
import { TbPencil } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import axios_base_api from '@/api/axios-base-api'
import {
    bathroomsOptions,
    bedroomsOptions,
    columnOptions,
    logicalOperatorOptions,
    operatorOptions,
    quickSearchFields,
    statusOptions,
} from '../components/Constants'
import usePropertyList from '../hooks/usePropertyList'

// Types
interface StatusCount {
    status: string
    count: number
}

// =============================================================================

export default function PropertyListView() {
    // const { user_info } = useAuthContext()
    // const isAdmin = user_info?.role_value === 'ADMIN'
    const navigate = useNavigate()
    // const dispatch = useAppDispatch()
    const [selectedProperty, setSelectedProperty] = useState<any>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [advancedFilters, setAdvancedFilters] = useState<any[]>([])
    const [isFilterActive, setIsFilterActive] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [lastRefreshed, setLastRefreshed] = useState<string | null>(null)

    const {
        propertyList,
        propertyListTotal,
        isLoading,
        tableData,
        setTableData,
        fetchData,
    } = usePropertyList(advancedFilters)

    // Calculate status counts from propertyList data
    const statusCounts = useMemo(() => {
        const counts: { [key: string]: number } = {}

        propertyList.forEach((property) => {
            const status = property.status || 'INACTIVE'
            counts[status] = (counts[status] || 0) + 1
        })

        return Object.entries(counts).map(([status, count]) => ({
            status,
            count,
        }))
    }, [propertyList])

    const handleView = (property: any) => {
        setSelectedProperty(property)
        setIsDrawerOpen(true)
    }

    const handleDrawerClose = () => {
        setIsDrawerOpen(false)
        setSelectedProperty(null)
    }

    const columns: ColumnDef<any>[] = useMemo(
        () => [
            {
                header: 'Actions',
                id: 'action',
                enableSorting: false,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex justify-start gap-2 ">
                            <Tooltip title="View Details" wrapperClass="flex">
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleView(row)}
                                >
                                    <Eye className="h-4 w-4 font-bold heading-text" />
                                </Button>
                            </Tooltip>
                            <Tooltip title="Edit" wrapperClass="flex">
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() =>
                                        navigate(
                                            getPropertyEditUrl(
                                                row.property_details_uuid,
                                            ),
                                        )
                                    }
                                >
                                    <TbPencil className="h-4 w-4 font-bold heading-text" />
                                </Button>
                            </Tooltip>
                            <Tooltip title="Visit Website" wrapperClass="flex">
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => {
                                        window.open(
                                            getPropertyPublicUrl(row.slug),
                                            '_blank',
                                        )
                                    }}
                                >
                                    <ExternalLink className="h-4 w-4 font-bold heading-text" />
                                </Button>
                            </Tooltip>
                        </div>
                    )
                },
            },
            {
                header: 'Name',
                accessorKey: 'property_details_name',
                enableSorting: true,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div
                            className="flex flex-col cursor-pointer"
                            onClick={() =>
                                navigate(
                                    getPropertyEditUrl(
                                        row.property_details_uuid,
                                    ),
                                )
                            }
                        >
                            <span className="font-bold heading-text">
                                {row.property_details_name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                #{row.property_details_uuid}
                            </span>
                        </div>
                    )
                },
            },
            {
                header: 'Property Id',
                accessorKey: 'id',
                enableSorting: true,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="font-bold heading-text">
                            {row.id || '--'}
                        </span>
                    )
                },
            },
            {
                header: 'Images',
                enableSorting: true,
                accessorKey: 'property_images',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="heading-text">
                            {row.property_images?.reduce(
                                (total: number, album: any) =>
                                    total + (album.paths?.length || 0),
                                0,
                            ) || 0}
                        </span>
                    )
                },
            },
            {
                header: 'City',
                accessorKey: 'property_city',
                enableSorting: true,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="font-bold heading-text">
                            {row.property_city || '--'}
                        </span>
                    )
                },
            },
            {
                header: 'Area',
                accessorKey: 'area',
                enableSorting: true,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="heading-text">{row.area || '--'}</span>
                    )
                },
            },
        ],
        [navigate],
    )

    const handleSetTableData = (data: any) => {
        setTableData(data)
    }

    const handleSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = {
            key: sort.key,
            order: sort.order,
        }
        handleSetTableData(newTableData)
    }

    const handleSearch = (value: string) => {
        const newTableData = cloneDeep(tableData)
        newTableData.query = value
        newTableData.pageIndex = 1
        handleSetTableData(newTableData)
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

    const handleRefreshAll = async () => {
        setIsRefreshing(true)

        try {
            await insertPropertyWithPmsAsync(
                { page: tableData.pageIndex },
                async (isSuccess, data) => {
                    if (isSuccess) {
                        setLastRefreshed(new Date().toLocaleString())
                        console.log(lastRefreshed)
                        await fetchData()
                        toast.push(
                            <Notification type="success">
                                Properties refreshed successfully
                            </Notification>,
                            { placement: 'top-center' },
                        )
                    } else {
                        toast.push(
                            <Notification type="danger">
                                Failed to refresh properties
                            </Notification>,
                            { placement: 'top-center' },
                        )
                    }
                    setIsRefreshing(false)
                },
            )
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    Error refreshing properties
                </Notification>,
                { placement: 'top-center' },
            )
            setIsRefreshing(false)
        }
    }
    useEffect(() => {
        fetchData()
    }, [tableData])

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
                            {propertyListTotal?.toLocaleString()} Total
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
                                hover:shadow-sm
                            `}
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
        <Card className="h-full">
            <div className="p-4 space-y-6">
                <ListActionTools
                    title="Properties"
                    advancedFilterConfig={{
                        columnOptions,
                        operatorOptions,
                        logicalOperatorOptions,
                        selectOptions: {
                            status: statusOptions,
                            bedrooms: bedroomsOptions,
                            bathroom_full: bathroomsOptions,
                        },
                    }}
                    quickSearchFields={quickSearchFields}
                    isFilterActive={isFilterActive}
                    onAdvancedSearch={handleAdvancedSearch}
                    onQuickSearch={handleQuickSearch}
                    onResetFilters={handleResetFilters}
                    onRefresh={handleRefreshAll}
                    isRefreshing={isRefreshing}
                    lastRefreshed={lastRefreshed}
                />

                {/* Status Dashboard */}
                <StatusDashboard />

                {/* <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search Property..."
                        className="pl-10"
                        value={tableData.query}
                        onChange={(e) => handleSearch(e.target.value)}
                    />

                    <PropertyListTableTools />
                </div> */}

                <DataTable
                    columns={columns}
                    data={propertyList}
                    loading={isLoading}
                    noData={!isLoading && propertyList.length === 0}
                    pagingData={{
                        total: propertyListTotal,
                        pageIndex: tableData.pageIndex ?? 0,
                        pageSize: tableData.pageSize ?? 0,
                    }}
                    onPaginationChange={(newPage) => {
                        const newTableData = cloneDeep(tableData)
                        newTableData.pageIndex = newPage
                        handleSetTableData(newTableData)
                    }}
                    onSelectChange={(newPageSize) => {
                        const newTableData = cloneDeep(tableData)
                        newTableData.pageSize = newPageSize
                        newTableData.pageIndex = 1
                        handleSetTableData(newTableData)
                    }}
                    onSort={handleSort}
                />
            </div>

            <Drawer
                title="Property Details"
                isOpen={isDrawerOpen}
                onClose={handleDrawerClose}
                onRequestClose={handleDrawerClose}
                width={500}
            >
                {selectedProperty && (
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-gray-800 pb-4">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    {selectedProperty.property_details_name}
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                                    {selectedProperty.slug}
                                </p>
                            </div>
                            <div
                                className={`px-3 py-1 rounded-full text-xs font-medium ${selectedProperty.status === 'ACTIVE' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}
                            >
                                {selectedProperty.status || 'INACTIVE'}
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="mb-6">
                            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
                                Basic Information
                            </h2>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Property Type
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedProperty.property_type || '-'}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <BedDouble className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Bedrooms
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedProperty.bedrooms || '0'}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Bath className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Bathrooms
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedProperty.bathroom_full || '0'}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Users className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Max Occupancy
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedProperty.max_occupancy || '0'}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <BedDouble className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Available Beds
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedProperty.available_beds || '0'}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Star className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Rating
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedProperty.property_rating ||
                                            '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Location Information */}
                        <div className="mb-6">
                            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
                                Location
                            </h2>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Address
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100 text-right">
                                        {selectedProperty.property_address_line_1 ||
                                            '-'}
                                        {selectedProperty.property_address_line_2 && (
                                            <br />
                                        )}
                                        {
                                            selectedProperty.property_address_line_2
                                        }
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Home className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Area
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedProperty.area || '-'}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            City
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedProperty.property_city || '-'}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            State
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedProperty.property_state || '-'}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Country
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedProperty.property_country ||
                                            '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="mb-6">
                            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
                                Contact Information
                            </h2>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Phone
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedProperty.phone || '-'}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Email
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedProperty.email || '-'}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Globe className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Website
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedProperty.web || '-'}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <User className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Manager
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedProperty.user_name || '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Property Description */}
                        {selectedProperty.about_property && (
                            <div className="mb-6">
                                <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
                                    About Property
                                </h2>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                    <div
                                        className="text-sm text-gray-600 dark:text-gray-300"
                                        dangerouslySetInnerHTML={{
                                            __html: selectedProperty.about_property,
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Drawer>
        </Card>
    )
}

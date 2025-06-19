import { ConfirmDialog, DataTable } from '@/components/shared'
import { ColumnDef, OnSortParam } from '@/components/shared/DataTable'
import { Dialog, Notification, Tag, toast, Tooltip } from '@/components/ui'
import {
    fetchReferralsAsync,
    updateReferralAsync,
} from '@/redux/child-reducers/referral/referral.actions'
import {
    ILoadState,
    IReferral,
    ISearchReferralParams,
    useAppDispatch,
    useAppSelector,
} from '@/redux'
import moment from 'moment'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { vite_app_routes } from '@/router/vite-app-routes'
import { TbPencil, TbTrash } from 'react-icons/tb'
import { cloneDeep } from 'lodash'
import { TableQueries } from '@/@types/common'
import ListActionTools from '@/components/filters/ListActionTools'
import {
    statusOptions,
    columnOptions,
    operatorOptions,
    logicalOperatorOptions,
    quickSearchFields,
    typeOptions,
} from './Constants'
import axios_base_api from '@/api/axios-base-api'
import { CheckCircle, XCircle, BarChart3 } from 'lucide-react'

const statusColor: Record<string, string> = {
    active: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    inactive: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
}

// Types
interface StatusCount {
    status: string
    count: number
}

const ReferralListTable = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isFilterActive, setIsFilterActive] = useState(false)
    const [referralToDelete, setReferralToDelete] = useState<IReferral | null>(
        null,
    )
    const [advancedFilters, setAdvancedFilters] = useState<any[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [tableData, setTableData] = useState<TableQueries>({
        pageIndex: 1,
        pageSize: 50,
        sort: { order: 'desc' as const, key: 'create_ts' },
        query: '',
    })

    const {
        data = [],
        count = 0,
        loading,
    } = useAppSelector((state) => state.dataManagement.referral.referral_list)

    const [searchParams, setSearchParams] = useState<ISearchReferralParams>({
        pageNo: 1,
        itemPerPage: 10,
        value: '',
        columns: [],
        status: '',
    })

    // Calculate status counts from data
    const statusCounts = useMemo(() => {
        const counts: { [key: string]: number } = {}
        
        // Ensure data is an array before processing
        const dataArray = Array.isArray(data) ? data : []
        
        dataArray.forEach((referral) => {
            const status = referral.status || 'unknown'
            counts[status] = (counts[status] || 0) + 1
        })

        return Object.entries(counts).map(([status, count]) => ({
            status,
            count,
        }))
    }, [data])

    const handleSetTableData = (data: TableQueries) => {
        setTableData(data)
    }

    const handleSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        setTableData(newTableData)
    }

    const sortByCreateTs = (data: IReferral[]) => {
        return [...data].sort((a, b) => {
            const dateA = a.create_ts ? new Date(a.create_ts).getTime() : 0
            const dateB = b.create_ts ? new Date(b.create_ts).getTime() : 0
            return dateB - dateA
        })
    }

    const sortedData = useMemo(() => {
        const dataArray = Array.isArray(data) ? data : []
        return sortByCreateTs(dataArray)
    }, [data])

    useEffect(() => {
        dispatch(
            fetchReferralsAsync({
                page: tableData.pageIndex || 1,
                rowsPerPage: tableData.pageSize || 10,
                ...(tableData.query
                    ? {
                          searchValue: tableData.query,
                          columns: ['type', 'referral', 'ip'],
                      }
                    : {}),
                ...(advancedFilters.length > 0
                    ? {
                          advanceFilter: JSON.stringify(advancedFilters),
                      }
                    : {}),
            }),
        )
    }, [dispatch, tableData, advancedFilters])

    const handlePaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        handleSetTableData(newTableData)
    }

    const handleSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = value
        newTableData.pageIndex = 1
        handleSetTableData(newTableData)
    }

    const handleEdit = (bni_clicks_uuid: string) => {
        navigate(
            `${vite_app_routes.app.admin.referral}/edit/${bni_clicks_uuid}`,
        )
    }

    const handleDeleteClick = (referral: IReferral) => {
        setReferralToDelete(referral)
        setDeleteConfirmationOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!referralToDelete) return

        try {
            await dispatch(
                updateReferralAsync({
                    payload: {
                        bni_clicks_uuid: referralToDelete.bni_clicks_uuid,
                        type: referralToDelete.type,
                        referral: referralToDelete.referral,
                        ip: referralToDelete.ip,
                        status: 'INACTIVE', // This should update the existing record
                    },
                    onSuccess: (isSuccess) => {
                        if (isSuccess) {
                            toast.push(
                                <Notification type="success">
                                    Referral status updated successfully
                                </Notification>,
                                { placement: 'top-center' },
                            )
                            dispatch(
                                fetchReferralsAsync({
                                    page: tableData.pageIndex,
                                    rowsPerPage: tableData.pageSize,
                                    ...(tableData.query
                                        ? {
                                              searchValue: tableData.query,
                                              columns: [
                                                  'type',
                                                  'referral',
                                                  'ip',
                                              ],
                                          }
                                        : {}),
                                    ...(advancedFilters.length > 0
                                        ? {
                                              advanceFilter:
                                                  JSON.stringify(
                                                      advancedFilters,
                                                  ),
                                          }
                                        : {}),
                                }),
                            )
                        } else {
                            toast.push(
                                <Notification type="danger">
                                    Failed to update referral status
                                </Notification>,
                                { placement: 'top-center' },
                            )
                        }
                    },
                }),
            )
        } catch (error) {
            console.error(error)
            toast.push(
                <Notification type="danger">
                    Failed to update referral status
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setDeleteConfirmationOpen(false)
            setReferralToDelete(null)
        }
    }

    const handleCancelDelete = () => {
        setDeleteConfirmationOpen(false)
        setReferralToDelete(null)
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

    const ActionColumn = ({ row }: { row: IReferral }) => {
        return (
            <div className="flex items-center gap-3">
                <Tooltip title="Edit">
                    <div
                        className="text-xl cursor-pointer select-none font-bold heading-text"
                        onClick={() => handleEdit(row.bni_clicks_uuid)}
                    >
                        <TbPencil />
                    </div>
                </Tooltip>
                <Tooltip title="Delete">
                    <div
                        className="text-xl cursor-pointer select-none font-bold heading-text text-red-500"
                        onClick={() => handleDeleteClick(row)}
                    >
                        <TbTrash />
                    </div>
                </Tooltip>
            </div>
        )
    }

    const columns: ColumnDef<IReferral>[] = useMemo(
        () => [
            // {
            //     header: 'Action',
            //     id: 'action',
            //     cell: (props) => <ActionColumn row={props.row.original} />,
            // },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const status = props.row.original.status.toLowerCase()
                    return (
                        <Tag className={statusColor[status] || 'bg-gray-200'}>
                            <span className="capitalize">{status}</span>
                        </Tag>
                    )
                },
            },
            {
                header: 'Type',
                accessorKey: 'type',
                cell: (props) => (
                    <span className="font-bold heading-text">
                        {props.row.original.type}
                    </span>
                ),
            },
            {
                header: 'Referral',
                accessorKey: 'referral',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.referral || 'N/A'}
                    </span>
                ),
            },
            {
                header: 'IP Address',
                accessorKey: 'ip',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.ip}
                    </span>
                ),
            },
            {
                header: 'Created By',
                accessorKey: 'created_by_name',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.created_by_name || 'System'}
                    </span>
                ),
            },
            {
                header: 'Created At',
                accessorKey: 'create_ts',
                cell: (props) => (
                    <div className="flex flex-col">
                        <span className="font-bold heading-text">
                            {moment(props.row.original.create_ts).format(
                                'MMMM D, YYYY',
                            )}
                        </span>
                        <small>
                            {moment(props.row.original.create_ts).format(
                                'hh:mm A',
                            )}
                        </small>
                    </div>
                ),
            },
        ],
        [],
    )

    const csvData = (Array.isArray(data) ? data : []).map((referral) => ({
        Type: referral.type,
        Referral: referral.referral || 'N/A',
        'IP Address': referral.ip,
        Status: referral.status,
        'Created By': referral.created_by_name || 'System',
        'Created At': moment(referral.create_ts).format('MMMM D, YYYY hh:mm A'),
    }))

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

        const totalDisplayedCount = statusCounts.reduce(
            (sum, item) => sum + item.count,
            0,
        )

        if (loading === ILoadState.pending) {
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
                            {count?.toLocaleString()} Total
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
                                {totalDisplayedCount > 0
                                    ? ((item.count / totalDisplayedCount) * 100).toFixed(1)
                                    : 0}%
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
                title="Referrals"
                advancedFilterConfig={{
                    columnOptions,
                    operatorOptions,
                    logicalOperatorOptions,
                    selectOptions: {
                        status: statusOptions,
                        type: typeOptions,
                    },
                }}
                quickSearchFields={quickSearchFields}
                csvData={csvData}
                isFilterActive={isFilterActive}
                onAdvancedSearch={handleAdvancedSearch}
                onQuickSearch={handleQuickSearch}
                onResetFilters={handleResetFilters}
            />

            {/* Status Dashboard */}
            <StatusDashboard />

            <DataTable
                selectable
                columns={columns}
                data={sortedData}
                noData={!loading && (!Array.isArray(data) || data.length === 0)}
                loading={ILoadState.pending === loading}
                pagingData={{
                    total: count,
                    pageIndex: tableData.pageIndex ?? 1,
                    pageSize: tableData.pageSize ?? 10,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
            />

            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Deactivate Referral"
                onClose={handleCancelDelete}
                onRequestClose={handleCancelDelete}
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to delete this referral? This action
                    cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default ReferralListTable

import { ConfirmDialog, Container, DataTable } from '@/components/shared'
import { ColumnDef } from '@/components/shared/DataTable'
import { Dialog, Notification, Tag, toast, Tooltip } from '@/components/ui'
import {
    fetchVouchersAsync,
    ISearchVoucherParams,
    updateVoucherAsync,
} from '@/redux/child-reducers/voucher'
import { ILoadState, useAppDispatch, useAppSelector } from '@/redux'
import moment from 'moment'
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { vite_app_routes } from '@/router/vite-app-routes'
import { TbPencil, TbTrash } from 'react-icons/tb'
import { Voucher } from '../types'
import VoucherListActionTools from './VoucherListActionTools'
import { cloneDeep } from 'lodash'
import { TableQueries } from '@/@types/common'
import ListActionTools from '@/components/filters/ListActionTools'
import {
    statusOptions,
    columnOptions,
    operatorOptions,
    logicalOperatorOptions,
    quickSearchFields,
    labelOptions,
    discountOptions,
} from './Constants'
import NewVoucherForm from './NewVoucherForm'
import axios_base_api from '@/api/axios-base-api'
import {
    CheckCircle,
    XCircle,
    BarChart3,
    Clock,
} from 'lucide-react'

const statusColor: Record<string, string> = {
    active: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    expired: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
    pending:
        'bg-yellow-200 dark:bg-yellow-200 text-gray-900 dark:text-gray-900',
}

// Types
interface StatusCount {
    status: string
    count: number
}

const VoucherListTable = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [isLoading, setIsLoading] = useState(false)
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isFilterActive, setIsFilterActive] = useState(false)
    const [voucherToDelete, setVoucherToDelete] = useState<Voucher | null>(null)
    const [advancedFilters, setAdvancedFilters] = useState<any[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [tableData, setTableData] = useState<TableQueries>({
        pageIndex: 1,
        pageSize: 50,
        sort: { order: 'desc' as const, key: 'order_id' },
        query: '',
    })

    const {
        data = [],
        count = 0,
        loading,
    } = useAppSelector((state) => state.management.vouchers.voucher_list)

    const [searchParams, setSearchParams] = useState<ISearchVoucherParams>({
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
        
        dataArray.forEach((voucher) => {
            const status = voucher.status || 'unknown'
            counts[status] = (counts[status] || 0) + 1
        })

        return Object.entries(counts).map(([status, count]) => ({
            status,
            count,
        }))
    }, [data])

    useEffect(() => {
        dispatch(
            fetchVouchersAsync({
                page: searchParams.pageNo,
                rowsPerPage: searchParams.itemPerPage,
                ...(tableData.query
                    ? {
                          searchValue: tableData.query,
                          columns: ['voucher_code', 'label', 'discount_type'],
                      }
                    : {}),
                ...(advancedFilters.length > 0
                    ? {
                          advanceFilter: JSON.stringify(advancedFilters),
                      }
                    : {}),
                ...(searchParams.status ? { status: searchParams.status } : {}),
            }),
        )
    }, [
        dispatch,
        searchParams.pageNo,
        searchParams.itemPerPage,
        tableData.query,
        tableData.sort,
        advancedFilters,
        searchParams.status,
    ])

    const handlePaginationChange = (page: number) => {
        setSearchParams((prev) => ({ ...prev, pageNo: page }))
    }

    const handleSelectChange = (value: number) => {
        setSearchParams((prev) => ({ ...prev, itemPerPage: value, pageNo: 1 }))
    }

    const handleView = (voucher_uuid: string) => {
        navigate(`${vite_app_routes.app.admin.vouchers}/view/${voucher_uuid}`)
    }

    const handleEdit = (voucher_uuid: string) => {
        navigate(`${vite_app_routes.app.admin.vouchers}/edit/${voucher_uuid}`)
    }

    const handleDeleteClick = (voucher: Voucher) => {
        setVoucherToDelete(voucher)
        setDeleteConfirmationOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!voucherToDelete) return

        try {
            await dispatch(
                updateVoucherAsync({
                    payload: { ...voucherToDelete, status: 'DELETE' },
                    onSuccess: (isSuccess) => {
                        if (isSuccess) {
                            toast.push(
                                <Notification type="success">
                                    Voucher deleted successfully
                                </Notification>,
                                { placement: 'top-center' },
                            )
                            dispatch(
                                fetchVouchersAsync({
                                    page: searchParams.pageNo,
                                    rowsPerPage: searchParams.itemPerPage,
                                }),
                            )
                        }
                    },
                }),
            )
        } catch (error) {
            console.error(error)
            toast.push(
                <Notification type="danger">
                    Failed to delete voucher
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setDeleteConfirmationOpen(false)
            setVoucherToDelete(null)
        }
    }

    const handleCancelDelete = () => {
        setDeleteConfirmationOpen(false)
        setVoucherToDelete(null)
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
        setSearchParams((prev) => ({ ...prev, pageNo: 1 }))
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
        setSearchParams((prev) => ({ ...prev, pageNo: 1 }))
    }

    const handleResetFilters = () => {
        setAdvancedFilters([])
        setIsFilterActive(false)
        setSearchParams((prev) => ({ ...prev, pageNo: 1 }))
    }

    const ActionColumn = ({ row }: { row: Voucher }) => {
        return (
            <div className="flex items-center gap-3">
                {/* <Tooltip title="View">
                    <div
                        className="text-xl cursor-pointer select-none font-semibold"
                        onClick={() => handleView(voucher_uuid)}
                    >
                        <TbEye />
                    </div>
                </Tooltip> */}
                <Tooltip title="Edit">
                    <div
                        className="text-xl cursor-pointer select-none font-bold heading-text"
                        onClick={() => handleEdit(row.voucher_uuid)}
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

    const columns: ColumnDef<Voucher>[] = useMemo(
        () => [
            {
                header: 'Action',
                id: 'action',
                cell: (props) => <ActionColumn row={props.row.original} />,
            },
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
                header: 'Promo Code',
                accessorKey: 'voucher_code',
                cell: (props) => (
                    <span className="font-bold heading-text">
                        {props.row.original.voucher_code}
                    </span>
                ),
            },
            {
                header: 'Label',
                accessorKey: 'label',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.label}
                    </span>
                ),
            },
            {
                header: 'Discount Type',
                accessorKey: 'discount_type',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.discount_type}
                    </span>
                ),
            },
            {
                header: 'Amount',
                accessorKey: 'amount',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.amount}
                    </span>
                ),
            },
            {
                header: 'Max Limit',
                accessorKey: 'max_limit',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.max_limit}
                    </span>
                ),
            },

            {
                header: 'Created At',
                accessorKey: 'created_at',
                cell: (props) => (
                    <div className="flex flex-col">
                        <span className="font-bold heading-text">
                            {moment(props.row.original.created_at).format(
                                'MMMM D, YYYY',
                            )}
                        </span>
                        <small>
                            {moment(props.row.original.created_at).format(
                                'hh:mm A',
                            )}
                        </small>
                    </div>
                ),
            },
        ],
        [],
    )
    const csvData = (Array.isArray(data) ? data : []).map((voucher) => ({
        'Voucher Code': voucher.voucher_code,
        Label: voucher.label,
        'Discount Type': voucher.discount_type,
        Amount: voucher.amount,
        'Max Limit': voucher.max_limit,
        Status: voucher.status,
        'Created At': moment(voucher.created_at).format('MMMM D, YYYY hh:mm A'),
    }))

    // Status Dashboard Component
    const StatusDashboard = () => {
        const getStatusIcon = (status: string) => {
            switch (status.toLowerCase()) {
                case 'active':
                    return <CheckCircle className="w-5 h-5 text-green-600" />
                case 'expired':
                    return <XCircle className="w-5 h-5 text-red-600" />
                case 'pending':
                    return <Clock className="w-5 h-5 text-yellow-600" />
                default:
                    return <BarChart3 className="w-5 h-5 text-gray-600" />
            }
        }

        const getStatusColor = (status: string) => {
            switch (status.toLowerCase()) {
                case 'active':
                    return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30'
                case 'expired':
                    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30'
                case 'pending':
                    return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                default:
                    return 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
            }
        }

        const totalDisplayedCount = statusCounts.reduce((sum, item) => sum + item.count, 0)

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
                        {[...Array(4)].map((_, i) => (
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
                                setSearchParams((prev) => ({ ...prev, pageNo: 1 }))
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
                title="Promo Codes"
                advancedFilterConfig={{
                    columnOptions,
                    operatorOptions,
                    logicalOperatorOptions,
                    selectOptions: {
                        status: statusOptions,
                        label: labelOptions,
                        discount_type: discountOptions,
                    },
                }}
                quickSearchFields={quickSearchFields}
                csvData={csvData}
                isFilterActive={isFilterActive}
                onAdvancedSearch={handleAdvancedSearch}
                onQuickSearch={handleQuickSearch}
                onResetFilters={handleResetFilters}
                onAdd={() => setDialogOpen(true)}
                addButtonText="Create Promo Code"
            />

            {/* Status Dashboard */}
            <StatusDashboard />

            <DataTable
                selectable
                columns={columns}
                data={Array.isArray(data) ? data : []}
                noData={!loading && (!Array.isArray(data) || data.length === 0)}
                loading={ILoadState.pending === loading}
                pagingData={{
                    total: count,
                    pageIndex: searchParams.pageNo,
                    pageSize: searchParams.itemPerPage,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
            />

            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Delete Voucher"
                onClose={handleCancelDelete}
                onRequestClose={handleCancelDelete}
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to delete this voucher? This action
                    cannot be undone.
                </p>
            </ConfirmDialog>

            <Dialog
                isOpen={dialogOpen}
                contentClassName="h-[80vh]"
                onClose={() => setDialogOpen(false)}
            >
                <h4>Add New Promo Code</h4>
                <div className="mt-4 overflow-y-auto flex-1 px-2">
                    <NewVoucherForm onClose={() => setDialogOpen(false)} />
                </div>
            </Dialog>
        </>
    )
}

export default VoucherListTable

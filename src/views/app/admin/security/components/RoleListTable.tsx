import { Container, DataTable } from '@/components/shared'
import { ColumnDef } from '@/components/shared/DataTable'
import { Notification, Tag, toast, Tooltip } from '@/components/ui'

import {
    fetchMultipleSecurityRolesAsync,
    ISearchSecurityRolesParams,
    useAppDispatch,
    useAppSelector,
} from '@/redux'
import moment from 'moment'
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { vite_app_routes } from '@/router/vite-app-routes'
import { TbCopy, TbPencil, TbTrash } from 'react-icons/tb'
import { Role } from '../types'

const statusColor: Record<string, string> = {
    active: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    expired: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
    pending:
        'bg-yellow-200 dark:bg-yellow-200 text-gray-900 dark:text-gray-900',
}

const RoleListTable = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const {
        list,
        loading,
        totalRecords: count,
    } = useAppSelector((state) => state.management.security.roles)

    const [searchParams, setSearchParams] =
        useState<ISearchSecurityRolesParams>({
            pageNo: 1,
            itemPerPage: 10,
            value: '',
            columns: [],

            status: '',
        })

    React.useEffect(() => {
        dispatch(
            fetchMultipleSecurityRolesAsync({
                pageNo: searchParams.pageNo,
                itemPerPage: searchParams.itemPerPage,
            }),
        )
    }, [dispatch, searchParams])

    const handlePaginationChange = (page: number) => {
        setSearchParams((prev) => ({ ...prev, pageNo: page }))
    }

    const handleSelectChange = (value: number) => {
        setSearchParams((prev) => ({ ...prev, itemPerPage: value, pageNo: 1 }))
    }

    const handleView = (role_uuid: string) => {
        navigate(`${vite_app_routes.app.admin.security.root}/view/${role_uuid}`)
    }

    const handleEdit = (role_uuid: string) => {
        navigate(`${vite_app_routes.app.admin.security.root}/edit/${role_uuid}`)
    }

    const handleDuplicate = (role_uuid: string) => {
        toast.push(
            <Notification type="info">Preparing duplicate...</Notification>,
        )
        navigate(
            `${vite_app_routes.app.admin.security.root}/duplicate/${role_uuid}`,
            {
                state: { refreshList: true },
            },
        )
    }

    // const handleDelete = async (voucher: Voucher) => {
    //     if (window.confirm('Are you sure you want to delete this voucher?')) {
    //         try {
    //             await dispatch(
    //                 upsertSecurityRoleGroupAsync({
    //                     payload: { ...voucher, status: 'INACTIVE' },
    //                     onSuccess: (isSuccess) => {
    //                         if (isSuccess) {
    //                             toast.push(
    //                                 <Notification type="success">
    //                                     Role Group deleted successfully
    //                                 </Notification>,
    //                                 { placement: 'top-center' },
    //                             )
    //                         dispatch(
    //         fetchSecurityRoleGroupListAsync({
    //             page: searchParams.page,
    //             rowsPerPage: searchParams.rowsPerPage,
    //         }),
    //                             )
    //                         }
    //                     },
    //                 }),
    //             )
    //         } catch (error) {
    //             console.error(error)
    //             toast.push(
    //                 <Notification type="danger">
    //                     Failed to delete voucher
    //                 </Notification>,
    //                 { placement: 'top-center' },
    //             )
    //         }
    //     }
    // }

    const ActionColumn = ({ row }: { row: Role }) => {
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
                        onClick={() => handleEdit(row.role_uuid)}
                    >
                        <TbPencil />
                    </div>
                </Tooltip>
                <Tooltip title="Duplicate">
                    <div
                        className="text-xl cursor-pointer select-none font-bold heading-text text-red-500"
                        onClick={() => handleDuplicate(row.role_uuid)}
                    >
                        <TbCopy />
                    </div>
                </Tooltip>
                {/* <Tooltip title="Delete">
                    <div
                        className="text-xl cursor-pointer select-none font-semibold text-red-500"
                        onClick={() => handleDelete(row)}
                    >
                        <TbTrash />
                    </div>
                </Tooltip> */}
            </div>
        )
    }

    const columns: ColumnDef<Role>[] = useMemo(
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
                header: 'Role ID',
                accessorKey: 'role_id',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.role_id}
                    </span>
                ),
            },
            {
                header: 'Role Name',
                accessorKey: 'role_name',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.role_name}
                    </span>
                ),
            },
            {
                header: 'Role Group',
                accessorKey: 'role_group',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.role_group}
                    </span>
                ),
            },
        ],
        [],
    )

    return (
        <Container>
            <DataTable
                columns={columns}
                data={list || []}
                noData={!loading && (list || []).length === 0}
                // loading={loading}
                pagingData={{
                    total: count,
                    pageIndex: searchParams.pageNo,
                    pageSize: searchParams.itemPerPage,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
            />
        </Container>
    )
}

export default RoleListTable

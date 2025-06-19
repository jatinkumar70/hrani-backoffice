import { Container, DataTable } from '@/components/shared'
import { ColumnDef } from '@/components/shared/DataTable'
import { Dialog, Notification, Tag, toast, Tooltip } from '@/components/ui'

import {
    fetchSecurityRoleGroupListAsync,
    upsertSecurityRoleGroupAsync,
    useAppDispatch,
    useAppSelector,
} from '@/redux'
import { ILoadState } from '@/redux/store.enums'
import moment from 'moment'
import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { vite_app_routes } from '@/router/vite-app-routes'
import { TbPencil, TbTrash } from 'react-icons/tb'
import { RoleGroup } from '../types'
import { mockRoleGroupData } from './mockRoleGroupsData'
import NewRoleGroupForm from './NewRoleGroupForm'

const statusColor: Record<string, string> = {
    active: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    expired: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
    pending:
        'bg-yellow-200 dark:bg-yellow-200 text-gray-900 dark:text-gray-900',
}

const RoleGroupsListTable = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedRoleGroupUUID, setSelectedRoleGroupUUID] = useState('')

    const {
        list: roleGroups,
        totalRecords: count,
    } = useAppSelector((state) => state.management.security.roleGroups)

    const [searchParams, setSearchParams] = useState({
        pageNo: 1,
        itemPerPage: 10,
    })

    React.useEffect(() => {
        dispatch(
            fetchSecurityRoleGroupListAsync({
                page: searchParams.pageNo,
                rowsPerPage: searchParams.itemPerPage,
            }),
        )
    }, [dispatch, searchParams])

    const handlePaginationChange = (page: number) => {
        setSearchParams((prev) => ({ ...prev, pageNo: page }))
    }

    const handleSelectChange = (value: number) => {
        setSearchParams((prev) => ({ ...prev, itemPerPage: value }))
    }

    const handleView = (role_group_uuid: string) => {
        navigate(
            `${vite_app_routes.app.admin.security.role_groups}/view/${role_group_uuid}`,
        )
    }

    const handleEdit = (role_group_uuid: string) => {
        navigate(
            `${vite_app_routes.app.admin.security.role_groups}/edit/${role_group_uuid}`,
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

    const ActionColumn = ({ row }: { row: RoleGroup }) => {
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
                        // onClick={() => handleEdit(row.role_group_uuid)}
                        onClick={() => {
                            setSelectedRoleGroupUUID(row.role_group_uuid)
                            setDialogOpen(true)
                        }}
                    >
                        <TbPencil />
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

    const columns: ColumnDef<RoleGroup>[] = useMemo(
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
                header: 'Role Group',
                accessorKey: 'role_group',
                cell: (props) => (
                    <span className="font-bold heading-text">
                        {props.row.original.role_group}
                    </span>
                ),
            },

            {
                header: 'Created At',
                accessorKey: 'created_at',
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

    return (
        <>
            <Container>
                <DataTable
                    columns={columns}
                    data={roleGroups || []}
                    noData={(roleGroups || []).length === 0}
                    pagingData={{
                        total: count,
                        pageIndex: searchParams.pageNo,
                        pageSize: searchParams.itemPerPage,
                    }}
                    onPaginationChange={handlePaginationChange}
                    onSelectChange={handleSelectChange}
                />

                {/* <DataTable
                    columns={columns}
                    data={mockRoleGroupData || []}
                    // noData={!loading && (roleGroups || []).length === 0}
                    // loading={loading}
                    pagingData={{
                        total: roleGroups.length,
                        pageIndex: searchParams.page,
                        pageSize: searchParams.rowsPerPage,
                    }}
                    onPaginationChange={handlePaginationChange}
                    onSelectChange={handleSelectChange}
                /> */}
            </Container>
            <Dialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)}>
                <h4>Edit Role Group</h4>
                <div className="mt-4">
                    <NewRoleGroupForm
                        isUpdate={true}
                        roleGroupUUID={selectedRoleGroupUUID}
                        onClose={() => setDialogOpen(false)}
                    />
                </div>
            </Dialog>
        </>
    )
}

export default RoleGroupsListTable

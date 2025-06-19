import { ConfirmDialog, DataTable } from '@/components/shared'
import { ColumnDef, Row } from '@/components/shared/DataTable'
import {
    Button,
    Card,
    Dialog,
    Input,
    Notification,
    Tag,
    toast,
    Tooltip,
} from '@/components/ui'
import Avatar from '@/components/ui/Avatar/Avatar'
import {
    fetchMultipleUsersWithArgsAsync,
    ILoadState,
    ISearchQueryParamsV2,
    IStoreState,
    IUserProfile,
    upsertSingleUserProfileWithCallbackAsync,
    useAppDispatch,
    useAppSelector,
} from '@/redux'

import RolesPermissionsUserAction from '@/views/concepts/accounts/RolesPermissions/components/RolesPermissionsUserAction'

import moment from 'moment'
import React, { useMemo, useState } from 'react'
import NewUserForm from './NewUserForm'
import { TbPencil, TbPlus } from 'react-icons/tb'
import { Link } from 'react-router'
import { vite_app_routes } from '@/router/vite-app-routes'

import { MdDeleteOutline } from 'react-icons/md'
import { useRolePermissionsStore } from '@/views/concepts/accounts/RolesPermissions/store/rolePermissionsStore'
import { Search } from 'lucide-react'
import { cloneDeep } from 'lodash'
import UserListTableTools from './components/UserListTableTools'

const statusColor: Record<string, string> = {
    active: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    blocked: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
}

const UserProfilesTable = () => {
    const dispatch = useAppDispatch()

    const { data: multipleDataArray, count: totalCount } = useAppSelector(
        (storeState: IStoreState) =>
            storeState.management.userProfiles.user_profile_list,
    )

    const [searchParams, setSearchParams] = useState<ISearchQueryParamsV2>({
        page: 1,
        rowsPerPage: 10,
        columns: [],
        searchValue: '',
        status: '',
    })
    const [selectedUsers, setSelectedUsers] = useState<IUserProfile[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [userProfileToDelete, setUserProfileToDelete] =
        useState<IUserProfile | null>(null)

    const fetchList = () => {
        dispatch(fetchMultipleUsersWithArgsAsync(searchParams))
    }

    const { tableData } = useRolePermissionsStore()

    React.useEffect(() => {
        dispatch(
            fetchMultipleUsersWithArgsAsync({
                ...searchParams,
                searchValue: tableData.query,
            }),
        )
    }, [dispatch, searchParams, tableData.query])

    React.useEffect(() => {
        fetchList()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

    const handlePaginationChange = (page: number) => {
        setSearchParams((prev) => ({ ...prev, page }))
    }

    const handleSelectChange = (value: number) => {
        setSearchParams((prev) => ({
            ...prev,
            rowsPerPage: value,
            page: 1, // Reset to first page when changing items per page
        }))
    }

    const handleRowSelect = (cheked: boolean, row: IUserProfile) => {
        setSelectedUsers((prev) => [...prev, row])
    }

    const handleAllRowSelect = (
        checked: boolean,
        rows: Row<IUserProfile>[],
    ) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectedUsers(originalRows)
        } else {
            setSelectedUsers([])
        }
    }

    // const handleEdit = (user: User) => {
    //     navigate(`${vite_app_routes.app.admin.users}/edit/${user.userId}`)
    // }

    const handleDeleteClick = (userProfile: IUserProfile) => {
        setUserProfileToDelete(userProfile)
        setDeleteConfirmationOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!userProfileToDelete) return

        try {
            await dispatch(
                upsertSingleUserProfileWithCallbackAsync({
                    payload: { ...userProfileToDelete, status: 'INACTIVE' },
                    onSuccess: (isSuccess) => {
                        if (isSuccess) {
                            toast.push(
                                <Notification type="success">
                                    Voucher deleted successfully
                                </Notification>,
                                { placement: 'top-center' },
                            )
                            dispatch(
                                fetchMultipleUsersWithArgsAsync(searchParams),
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
            setUserProfileToDelete(null)
        }
    }

    const handleCancelDelete = () => {
        setDeleteConfirmationOpen(false)
        setUserProfileToDelete(null)
    }

    // const ActionColumn = ({
    //     user_uuid,
    //     // onEdit,
    //     onDelete,
    // }: {
    //     user_uuid: string
    //     // onEdit: () => void
    //     onDelete: () => void
    // }) => {
    const ActionColumn = ({ row }: { row: IUserProfile }) => {
        return (
            <div className="flex items-center gap-3 ">
                <Tooltip title="Edit">
                    <Link
                        to={`${vite_app_routes.app.admin.users}/edit/${row.user_uuid}`}
                    >
                        <div
                            className={`text-xl cursor-pointer select-none font-bold heading-text`}
                            role="button"
                            // onClick={onEdit}
                        >
                            <TbPencil />
                        </div>
                    </Link>
                </Tooltip>
                <Tooltip title="Delete">
                    <div
                        className={`text-xl cursor-pointer select-none font-bold heading-text text-red-500`}
                        role="button"
                        onClick={() => handleDeleteClick(row)}
                    >
                        <MdDeleteOutline />
                    </div>
                </Tooltip>
            </div>
        )
    }

    const columns: ColumnDef<IUserProfile>[] = useMemo(
        () => [
            {
                header: 'Action',
                id: 'action',

                // cell: (props) => (
                //     <ActionColumn
                //         user_uuid={props.row.original.user_uuid}
                //         // onEdit={() => handleEdit(props.row.original)}
                //         onDelete={() => handleDelete(props.row.original)}
                //     />
                // ),

                cell: (props) => <ActionColumn row={props.row.original} />,
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const status = props.row.original.status.toLowerCase()
                    return (
                        <div className="flex items-center">
                            <Tag
                                className={statusColor[status] || 'bg-gray-200'}
                            >
                                <span className="capitalize">{status}</span>
                            </Tag>
                        </div>
                    )
                },
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    const fullName =
                        `${row.first_name} ${row.last_name || ''}`.trim()
                    return (
                        <Link
                            to={`${vite_app_routes.app.admin.users}/edit/${row.user_uuid}`}
                        >
                            <div className="flex items-center gap-2">
                                <Avatar
                                    size={40}
                                    shape="circle"
                                    src={''}
                                    name={fullName}
                                />
                                <div>
                                    <div className="font-bold heading-text">
                                        {`${row.first_name} ${row.last_name || ''}`.trim()}
                                    </div>
                                    <div>{row.email}</div>
                                </div>
                            </div>
                        </Link>
                    )
                },
            },

            {
                header: 'Role',
                accessorKey: 'role',
                size: 70,
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center font-bold heading-text">
                            <span>{row.role_value}</span>
                        </div>
                    )
                },
            },

            {
                header: 'Created At',
                accessorKey: 'lastOnline',
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
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [multipleDataArray],
    )

    return (
        <>
            <Card className="p-4">
                <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <h3>User Profiles</h3>
                        <Button
                            variant="solid"
                            icon={<TbPlus className="text-xl" />}
                            onClick={() => setDialogOpen(true)}
                        >
                            Create New User
                        </Button>
                    </div>
                </div>

                <Dialog
                    isOpen={dialogOpen}
                    contentClassName="h-[80vh]"
                    onClose={() => setDialogOpen(false)}
                >
                    <h4>Add New User</h4>
                    <div className="mt-4 overflow-y-auto flex-1 px-2">
                        <NewUserForm onClose={() => setDialogOpen(false)} />
                    </div>
                </Dialog>

                <div>
                    <div>
                        <div className="mb-6 flex flex-col gap-5">
                            <div className="flex-1">
                                {/* <RolesPermissionsUserAction /> */}
                                <UserListTableTools />
                            </div>
                        </div>
                        <DataTable
                            selectable
                            columns={columns}
                            data={multipleDataArray}
                            noData={multipleDataArray.length === 0}
                            skeletonAvatarColumns={[0]}
                            skeletonAvatarProps={{ width: 28, height: 28 }}
                            pagingData={{
                                total: totalCount,
                                pageIndex: searchParams.page as number,
                                pageSize: searchParams.rowsPerPage as number,
                            }}
                            checkboxChecked={(row) =>
                                selectedUsers.some(
                                    (selected) =>
                                        selected.user_uuid === row.user_uuid,
                                )
                            }
                            hoverable={false}
                            onPaginationChange={handlePaginationChange}
                            onSelectChange={handleSelectChange}
                            onCheckBoxChange={handleRowSelect}
                            onIndeterminateCheckBoxChange={handleAllRowSelect}
                        />
                    </div>
                </div>
            </Card>
            {/* <RolesPermissionsAccessDialog
                roleList={roleList}
                mutate={roleMutate}
            />
            <RolesPermissionsUserSelected
                userList={userList}
                userListTotal={userListTotal}
                mutate={userMutate}
            /> */}

            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Delete User"
                onClose={handleCancelDelete}
                onRequestClose={handleCancelDelete}
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to delete this user? This action
                    cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default UserProfilesTable

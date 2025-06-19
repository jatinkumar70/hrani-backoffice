import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import { produce } from 'immer'

import { useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
    Button,
    Notification,
    toast,
    Card,
    FormItem,
    Input,
    Select,
    Checkbox,
    Tooltip,
    Dropdown,
    Dialog,
} from '@/components/ui'
import { TbArrowNarrowLeft, TbTrash, TbLock, TbLockOpen } from 'react-icons/tb'

import {
    fetchSecurityGroupAsync,
    ILoadState,
    ISecurityGroup,
    ISecurityGroupWithChildren,
    RootState,
    upsertSecurityGroupAsync,
    useAppDispatch,
} from '@/redux'
import { Container } from '@/components/shared'
import { has, isEmpty, isObject } from 'lodash'
import { SecurityRoleGroupAutoSearch } from '@/redux/child-reducers/services/auto-search/SecurityRoleGroupAutoSearch'
import { RoleGroupSelector } from '../../role-groups/dropdowns/RoleGroupSelector'
import { RecordPremissionsRightPanel } from '../RecordPermissions/RecordPremissionsRightPanel'

const NewRoleForm: React.FC<{ isDuplicate?: boolean }> = (props) => {
    const { roleId } = useParams() as { roleId?: string }
    const isDuplicate = location.pathname.includes('/duplicate/')
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const { group, roleName, role_group, status, loading, error } = useSelector(
        (storeState: RootState) => storeState.management.security.groups,
    )

    const [saveLoading, setSaveLoading] = useState(false)
    const [role, setRole] = useState(roleId)
    // State to manage the permissions panel
    const [openPremissions, setOpenPremissions] = useState<{
        group: ISecurityGroup
        isSubModule: boolean
        index: number
        parentKey?: string
    } | null>(null)
    const isUpdate = role ? true : false

    const statusOptions = [
        { value: 'ACTIVE', label: 'Active' },
        { value: 'INACTIVE', label: 'Inactive' },
    ]

    const { values, handleChange, handleSubmit, setFieldValue, setValues } =
        useFormik({
            initialValues: {
                roleName: '',
                group: group,
                role_group: '',
                status: 'ACTIVE',
            },
            validate: (values) => {
                const errors: Record<string, string> = {}
                if (!values.roleName) {
                    errors.roleName = 'Role name is required'
                }
                if (!values.role_group) {
                    errors.role_group = 'Role group is required'
                }
                return errors
            },
            onSubmit: (values) => {
                setSaveLoading(true)
                dispatch(
                    upsertSecurityGroupAsync({
                        data: values.group,
                        roleId: roleId || null,
                        role_group: values.role_group,
                        roleName: values.roleName,
                        status: values.status,
                        onCallback: (isSuccess) => {
                            if (isSuccess) {
                                const successMessage = roleId
                                    ? isDuplicate
                                        ? 'Role duplicated successfully!'
                                        : 'Role updated successfully!'
                                    : 'Role created successfully!'
                                toast.push(
                                    <Notification
                                        title="Success"
                                        type="success"
                                    >
                                        {successMessage}
                                    </Notification>,
                                )
                                navigate('/app/security')
                            }
                            setSaveLoading(false)
                        },
                        isDuplicate,
                    }),
                )
            },
        })

    // Handler for saving permissions changes
    const handleSavePermissions = (updatedGroup: ISecurityGroup) => {
        if (openPremissions) {
            const { parentKey, index } = openPremissions

            const newState = produce(values, (draftValues) => {
                if (parentKey) {
                    draftValues.group.modules[parentKey].children.splice(
                        index,
                        1,
                        updatedGroup,
                    )
                }
            })
            setValues(newState)
            setOpenPremissions(null)
        }
    }

    const handleParentAccessChange =
        (parentKey: string) => (key: string, checked: number) => {
            const newState = produce(values, (draftValues) => {
                for (let index in values.group.modules[parentKey].children) {
                    draftValues.group.modules[parentKey].children[index][
                        key as 'view_access'
                    ] = checked ? 1 : 0
                }
            })
            setValues(newState)
        }

    const handlChildAccessChange =
        (parentKey: string) =>
        (key: string, index: number, checked: number) => {
            const newState = produce(values, (draftValues) => {
                draftValues.group.modules[parentKey].children[index][
                    key as 'view_access'
                ] = checked
            })
            setValues(newState)
        }

    useEffect(() => {
        dispatch(fetchSecurityGroupAsync(roleId))
    }, [roleId])

    useEffect(() => {
        let finalRoleName = roleName || ''
        if (isDuplicate) {
            finalRoleName = finalRoleName + ' - Copy'
        }
        setValues({
            ...values,
            group: group,
            roleName: finalRoleName,
            role_group: role_group as string,
            status: status || 'ACTIVE',
        })
    }, [group, roleName, role_group, status])

    useEffect(() => {
        if (error) {
            toast.push(
                <Notification title="Error" type="danger">
                    {error}
                </Notification>,
            )
        }
    }, [error])

    if (loading === ILoadState.pending) {
        return (
            <div className="flex justify-center items-center h-64">
                Loading...
            </div>
        )
    }

    if (loading === ILoadState.failed) {
        return (
            <Notification title="Error" type="danger">
                {error || 'Failed to load data'}
            </Notification>
        )
    }

    if (error) {
        return (
            <Notification title="Error" type="danger">
                {error}
            </Notification>
        )
    }

    return (
        <div className="flex flex-col min-h-[calc(100vh-250px)]">
            <Container className="flex-grow">
                <form onSubmit={handleSubmit}>
                    <Card className="h-full p-4 mb-4">
                        <h3>
                            {roleId
                                ? isDuplicate
                                    ? 'Duplicate'
                                    : 'Edit'
                                : 'Create'}
                            Role
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
                            <FormItem label="Role Name">
                                <Input
                                    name="roleName"
                                    value={values.roleName}
                                    disabled={
                                        roleId && !isDuplicate ? true : false
                                    }
                                    onChange={handleChange}
                                />
                            </FormItem>

                            <FormItem label="Role Group">
                                <RoleGroupSelector
                                    value={values.role_group}
                                    onSelect={(newValue) => {
                                        setFieldValue('role_group', newValue)
                                    }}
                                />
                            </FormItem>

                            <FormItem label="Status">
                                <Select
                                    options={statusOptions}
                                    value={statusOptions.find(
                                        (option) =>
                                            option.value === values.status,
                                    )}
                                    onChange={(selectedOption) => {
                                        setFieldValue(
                                            'status',
                                            selectedOption?.value || 'ACTIVE',
                                        )
                                    }}
                                />
                            </FormItem>
                        </div>

                        <div className="mt-6 mb-4">
                            <h4 className="text-lg font-medium">
                                Module Level Access
                            </h4>
                            <div className="border-b my-2"></div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Module Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Show
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Read
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Write
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Import
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Export
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Permissions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {Object.keys(values.group.modules).map(
                                        (key) => (
                                            <ModuleRow
                                                key={key}
                                                moduleName={key}
                                                group={
                                                    values.group.modules[key]
                                                }
                                                onParentAccessChange={handleParentAccessChange(
                                                    key,
                                                )}
                                                onChildAccessChange={handlChildAccessChange(
                                                    key,
                                                )}
                                                onOpenPremissions={(
                                                    group,
                                                    isSubModule,
                                                    index,
                                                ) => {
                                                    setOpenPremissions({
                                                        group,
                                                        isSubModule,
                                                        index,
                                                        parentKey: key,
                                                    })
                                                }}
                                            />
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Container>
                            <div className="flex items-center justify-between pt-8">
                                <Button
                                    className="mr-3"
                                    type="button"
                                    variant="plain"
                                    icon={<TbArrowNarrowLeft />}
                                    onClick={() => navigate(-1)}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    loading={saveLoading}
                                >
                                    Save
                                </Button>
                            </div>
                        </Container>
                    </Card>
                </form>
            </Container>

            {/* Permissions Panel */}
            {openPremissions && (
                <RecordPremissionsRightPanel
                    module={openPremissions.group}
                    open={true}
                    onClose={() => setOpenPremissions(null)}
                    onSave={handleSavePermissions}
                />
            )}
        </div>
    )
}

const ModuleRow = (props: {
    moduleName: string
    group: ISecurityGroupWithChildren
    onParentAccessChange: (key: string, checked: number) => void
    onChildAccessChange: (key: string, index: number, checked: number) => void
    onOpenPremissions: (
        group: ISecurityGroup,
        isSubModule: boolean,
        index: number,
    ) => void
}) => {
    const { group, moduleName } = props
    const [open, setOpen] = useState(false)

    const handleParentAccess =
        (key: string) =>
        (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => {
            props.onParentAccessChange(key, checked ? 1 : 0)
        }

    const handleChildAccessChange =
        (key: string, index: number) =>
        (checked: boolean, e: React.ChangeEvent<HTMLInputElement>) => {
            props.onChildAccessChange(key, index, checked ? 1 : 0)
        }

    return (
        <>
            <tr className={open ? 'bg-gray-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                    {group.children.length > 1 && (
                        <button
                            className="text-gray-500 hover:text-gray-700"
                            onClick={(e) => {
                                e.preventDefault()
                                setOpen(!open)
                            }}
                        >
                            {open ? '▼' : '►'}
                        </button>
                    )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                        {moduleName}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <Checkbox
                        checked={
                            group.children.filter((x) => x.show_module === 1)
                                .length === group.children.length
                        }
                        onChange={handleParentAccess('show_module')}
                    />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <Checkbox
                        checked={
                            group.children.filter((x) => x.view_access === 1)
                                .length === group.children.length
                        }
                        onChange={handleParentAccess('view_access')}
                    />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <Checkbox
                        checked={
                            group.children.filter((x) => x.edit_access === 1)
                                .length === group.children.length
                        }
                        onChange={handleParentAccess('edit_access')}
                    />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <Checkbox
                        checked={
                            group.children.filter((x) => x.bulk_import === 1)
                                .length === group.children.length
                        }
                        onChange={handleParentAccess('bulk_import')}
                    />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <Checkbox
                        checked={
                            group.children.filter((x) => x.bulk_export === 1)
                                .length === group.children.length
                        }
                        onChange={handleParentAccess('bulk_export')}
                    />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    {group.children.length === 1 && (
                        <Tooltip
                            title={
                                hasKeysInOrAnd(group.children[0].filter_values)
                                    ? 'Edit Permissions'
                                    : 'No Edit Permissions'
                            }
                        >
                            <button
                                className={`p-1 rounded ${!group.children[0].view_access ? 'opacity-50' : 'hover:bg-gray-100'}`}
                                disabled={!group.children[0].view_access}
                                onClick={(e) => {
                                    e.preventDefault()

                                    if (
                                        hasKeysInOrAnd(
                                            group.children[0].filter_values,
                                        )
                                    ) {
                                        props.onOpenPremissions(
                                            group.children[0],
                                            false,
                                            0,
                                        )
                                    }
                                }}
                            >
                                {!hasKeysInOrAnd(
                                    group.children[0].filter_values,
                                ) ? (
                                    <TbLock className="text-red-500" />
                                ) : (
                                    <TbLockOpen className="text-blue-500" />
                                )}
                            </button>
                        </Tooltip>
                    )}
                </td>
            </tr>

            {open && group.children.length > 1 && (
                <tr>
                    <td colSpan={12} className="px-0 py-0">
                        <div
                            className={`${open ? 'block' : 'hidden'} bg-gray-50`}
                        >
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Submodule Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Show
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Read
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Write
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Import
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Export
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Permissions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {group.children.map((subModule, index) => (
                                        <tr key={subModule.module_name}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {subModule.submodule_name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Checkbox
                                                    checked={
                                                        subModule.show_module ===
                                                        1
                                                    }
                                                    onChange={handleChildAccessChange(
                                                        'show_module',
                                                        index,
                                                    )}
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Checkbox
                                                    checked={
                                                        subModule.view_access ===
                                                        1
                                                    }
                                                    onChange={handleChildAccessChange(
                                                        'view_access',
                                                        index,
                                                    )}
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Checkbox
                                                    checked={
                                                        subModule.edit_access ===
                                                        1
                                                    }
                                                    onChange={handleChildAccessChange(
                                                        'edit_access',
                                                        index,
                                                    )}
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Checkbox
                                                    checked={
                                                        subModule.bulk_import ===
                                                        1
                                                    }
                                                    onChange={handleChildAccessChange(
                                                        'bulk_import',
                                                        index,
                                                    )}
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Checkbox
                                                    checked={
                                                        subModule.bulk_export ===
                                                        1
                                                    }
                                                    onChange={handleChildAccessChange(
                                                        'bulk_export',
                                                        index,
                                                    )}
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Tooltip
                                                    title={
                                                        hasKeysInOrAnd(
                                                            subModule.filter_values,
                                                        )
                                                            ? 'Edit Permissions'
                                                            : 'No Edit Permissions'
                                                    }
                                                >
                                                    <button
                                                        className={`p-1 rounded ${!subModule.view_access ? 'opacity-50' : 'hover:bg-gray-100'}`}
                                                        disabled={
                                                            !subModule.view_access
                                                        }
                                                        onClick={(e) => {
                                                            e.preventDefault()

                                                            if (
                                                                hasKeysInOrAnd(
                                                                    group
                                                                        .children[0]
                                                                        .filter_values,
                                                                )
                                                            ) {
                                                                props.onOpenPremissions(
                                                                    group
                                                                        .children[0],
                                                                    false,
                                                                    0,
                                                                )
                                                            }
                                                        }}
                                                    >
                                                        {!hasKeysInOrAnd(
                                                            subModule.filter_values,
                                                        ) ? (
                                                            <TbLock className="text-red-500" />
                                                        ) : (
                                                            <TbLockOpen className="text-blue-500" />
                                                        )}
                                                    </button>
                                                </Tooltip>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>
            )}
        </>
    )
}

function hasKeysInOrAnd(filterValues: Record<string, any>): boolean {
    if (isEmpty(filterValues)) {
        return false
    }

    if (
        has(filterValues, 'or') &&
        isObject(filterValues.or) &&
        !isEmpty(filterValues.or)
    ) {
        return true
    } else if (
        has(filterValues, 'and') &&
        isObject(filterValues.and) &&
        !isEmpty(filterValues.and)
    ) {
        return true
    }

    return false
}

export default NewRoleForm

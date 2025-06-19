import { useState } from 'react'
import { useFormik } from 'formik'
import {
    Button,
    FormItem,
    Input,
    Select,
    Notification,
    toast,
} from '@/components/ui'
import {
    ISecurityRoleGroup,
    upsertSecurityRoleGroupAsync,
    useAppDispatch,
} from '@/redux'
import { TbArrowNarrowLeft } from 'react-icons/tb'

const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
]

const NewRoleGroupForm = ({
    onClose,
    isUpdate = false,
    roleGroupUUID = '',
}: {
    onClose: () => void
    isUpdate?: boolean
    roleGroupUUID?: string
}) => {
    const dispatch = useAppDispatch()

    const [isSubmitting, setSubmitting] = useState(false)

    const { values, handleChange, handleSubmit, setFieldValue } = useFormik({
        initialValues: {
            role_group: '',
            status: 'ACTIVE',
        },
        validate: (values) => {
            const errors: Record<string, string> = {}
            if (!values.role_group) {
                errors.role_group = 'Role Group name is required'
            }
            return errors
        },
        onSubmit: async (values) => {
            setSubmitting(true)

            const roleGroupData: ISecurityRoleGroup = {
                role_group_uuid: roleGroupUUID || null,
                role_group: values.role_group,
                status: values.status,
            }

            try {
                await dispatch(
                    upsertSecurityRoleGroupAsync({
                        payload: roleGroupData,
                        onSuccess: (isSuccess) => {
                            if (isSuccess) {
                                const successMessage = isUpdate
                                    ? 'Role Group updated successfully!'
                                    : 'Role Group created successfully!'
                                toast.push(
                                    <Notification
                                        title="Success"
                                        type="success"
                                    >
                                        {successMessage}
                                    </Notification>,
                                )
                                onClose()
                            }
                        },
                    }),
                ).unwrap()
            } catch (error) {
                console.error(
                    `Failed to ${isUpdate ? 'update' : 'create'} role group:`,
                    error,
                )
                toast.push(
                    <Notification title="Error" type="danger">
                        {`Failed to ${isUpdate ? 'update' : 'create'} role group`}
                    </Notification>,
                )
            } finally {
                setSubmitting(false)
            }
        },
    })

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
                <FormItem
                    label="Role Group Name"
                    invalid={!values.role_group.trim()}
                    errorMessage={
                        !values.role_group.trim()
                            ? 'Role Group name is required'
                            : ''
                    }
                >
                    <Input
                        name="role_group"
                        type="text"
                        autoComplete="off"
                        placeholder="Enter role group name"
                        value={values.role_group}
                        onChange={handleChange}
                    />
                </FormItem>

                {isUpdate && (
                    <FormItem label="Status">
                        <Select
                            name="status"
                            options={statusOptions}
                            value={statusOptions.find(
                                (option) => option.value === values.status,
                            )}
                            onChange={(selectedOption) => {
                                setFieldValue(
                                    'status',
                                    selectedOption?.value || 'ACTIVE',
                                )
                            }}
                        />
                    </FormItem>
                )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
                <Button
                    variant="plain"
                    type="button"
                    icon={<TbArrowNarrowLeft />}
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button variant="solid" type="submit" loading={isSubmitting}>
                    {isUpdate ? 'Update Role Group' : 'Add Role Group'}
                </Button>
            </div>
        </form>
    )
}

export default NewRoleGroupForm

import { useEffect, useState } from 'react'
import { FormItem, Form } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'

import {
    createNewUserWithCallbackAsync,
    ICreateNewUser,
    useAppDispatch,
} from '@/redux'
import { RoleIdAutoSearch } from '@/redux/child-reducers/user-profile/auto-search/UserRoleAutosearch'
import { UserBranchAutosearch } from '@/redux/child-reducers/user-profile/auto-search/UserBranchAutosearch'

const statusOptions = [
    { value: 'UNAUTHORIZE', label: 'Unauthorized' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'BLOCKED', label: 'Blocked' },
]

type FormSchema = {
    first_name: string
    last_name: string
    email: string
    user_password: string
    confirmPassword: string
    status: 'UNAUTHORIZE' | 'ACTIVE' | 'INACTIVE' | 'BLOCKED'
    role_uuid: string
    role_value?: string | null
    branch_uuid?: string
    branch_name?: string | null
}

const validationSchema: ZodType<FormSchema> = z
    .object({
        first_name: z.string().min(1, { message: 'First name is required' }),
        last_name: z.string().min(1, { message: 'Last name is required' }),
        email: z.string().email({ message: 'Invalid email address' }),
        user_password: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters' }),
        confirmPassword: z
            .string()
            .min(1, { message: 'Please confirm your password' }),
        status: z.enum(['UNAUTHORIZE', 'ACTIVE', 'INACTIVE', 'BLOCKED']),
        role_uuid: z.string().min(1, { message: 'Role is required' }),
        role_value: z.string().optional(),
        branch_uuid: z.string().optional(), // Made optional
        branch_name: z.string().nullable().optional(), // Made optional
    })
    .refine((data) => data.user_password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    })

const NewUserForm = ({ onClose }: { onClose: () => void }) => {
    const dispatch = useAppDispatch()
    const [isSubmitting, setSubmitting] = useState(false)

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        reset,
    } = useForm<FormSchema>({
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            user_password: '',
            confirmPassword: '',
            status: 'ACTIVE',
            role_uuid: '',
            role_value: '',
            branch_uuid: '',
            branch_name: null,
        },
        resolver: zodResolver(validationSchema),
    })

    const onSubmit = async (formData: FormSchema) => {
        setSubmitting(true)

        const userData: ICreateNewUser = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            user_password: formData.user_password,
            status: formData.status,
            role_uuid: formData.role_uuid,
            role_value: formData.role_value || null,
            branch_uuid: null,
            branch_name: formData.branch_name || null,
            user_uuid: null,
        }

        dispatch(
            createNewUserWithCallbackAsync({
                payload: userData,
                onCallback: (isSuccess) => {
                    setSubmitting(false)
                    if (isSuccess) {
                        onClose()
                        reset()
                    }
                },
            }),
        )
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label="First Name"
                    invalid={Boolean(errors.first_name)}
                    errorMessage={errors.first_name?.message}
                >
                    <Controller
                        name="first_name"
                        control={control}
                        render={({ field }) => (
                            <Input type="text" autoComplete="off" {...field} />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Last Name"
                    invalid={Boolean(errors.last_name)}
                    errorMessage={errors.last_name?.message}
                >
                    <Controller
                        name="last_name"
                        control={control}
                        render={({ field }) => (
                            <Input type="text" autoComplete="off" {...field} />
                        )}
                    />
                </FormItem>
            </div>

            <FormItem
                label="Email"
                invalid={Boolean(errors.email)}
                errorMessage={errors.email?.message}
            >
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input type="email" autoComplete="off" {...field} />
                    )}
                />
            </FormItem>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label="Password"
                    invalid={Boolean(errors.user_password)}
                    errorMessage={errors.user_password?.message}
                >
                    <Controller
                        name="user_password"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="password"
                                autoComplete="new-password"
                                {...field}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Confirm Password"
                    invalid={Boolean(errors.confirmPassword)}
                    errorMessage={errors.confirmPassword?.message}
                >
                    <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="password"
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>

            <FormItem
                label="Role"
                invalid={Boolean(errors.role_uuid)}
                errorMessage={errors.role_uuid?.message}
            >
                <Controller
                    name="role_uuid"
                    control={control}
                    render={({ field }) => (
                        <RoleIdAutoSearch
                            label=""
                            value={{
                                role_uuid: field.value,
                                role_name: field.value
                                    ? control._formValues.role_value || ''
                                    : '',
                            }}
                            onSelect={(newValue) => {
                                field.onChange(newValue.role_uuid)
                                setValue('role_value', newValue.role_name)
                            }}
                        />
                    )}
                />
            </FormItem>

            {/* <FormItem
                label="Branch"
                // invalid={Boolean(errors.branch_uuid)}
                // errorMessage={errors.branch_uuid?.message}
            >
                <Controller
                    name="branch_uuid"
                    control={control}
                    render={({ field }) => (
                        <UserBranchAutosearch
                            label=""
                            value={{
                                branch_uuid: field.value || '',
                                branch_name: field.value
                                    ? control._formValues.branch_name || ''
                                    : '',
                            }}
                            onSelect={(newValue) => {
                                field.onChange(newValue.branch_uuid || null)
                                setValue(
                                    'branch_name',
                                    newValue.branch_name || null,
                                )
                            }}
                        />
                    )}
                />
            </FormItem> */}

            {/* <FormItem
                label="Status"
                invalid={Boolean(errors.status)}
                errorMessage={errors.status?.message}
            >
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select
                            options={statusOptions}
                            value={statusOptions.find(
                                (option) => option.value === field.value,
                            )}
                            onChange={(option) => field.onChange(option?.value)}
                        />
                    )}
                />
            </FormItem> */}

            <div className="flex justify-end gap-2 mt-6">
                <Button variant="plain" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="solid" type="submit" loading={isSubmitting}>
                    Create User
                </Button>
            </div>
        </Form>
    )
}

export default NewUserForm

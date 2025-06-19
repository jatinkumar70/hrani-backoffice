/* eslint-disable @typescript-eslint/no-unused-vars */
import NoUserFound from '@/assets/svg/NoUserFound'
import { ConfirmDialog } from '@/components/shared'
import { Button, DatePicker, Notification, toast } from '@/components/ui'
import {
    fetchSingleUserProfileWithArgsAsync,
    upsertSingleUserProfileWithCallbackAsync,
} from '@/redux/child-reducers/user-profile/user-profile.actions'
import { IUserProfile } from '@/redux/child-reducers/user-profile/user-profile.types'
import { useFormik } from 'formik'
import { useMemo, useState } from 'react'
import { TbArrowNarrowLeft, TbPlus, TbTrash } from 'react-icons/tb'
import { useNavigate, useParams } from 'react-router'
import useSWR from 'swr'

import { FormItem } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'

import { Avatar } from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'

import { countryList } from '@/constants/countries.constant'

import { Upload } from '@/components/ui/Upload'
import PhoneNumberInput from '@/components/ui/PhoneNumberInput'
import { RoleIdAutoSearch } from '@/redux/child-reducers/user-profile/auto-search/UserRoleAutosearch'
import { UserBranchAutosearch } from '@/redux/child-reducers/user-profile/auto-search/UserBranchAutosearch'

import { api } from '@/utils/api'
import { IRole, useAppDispatch } from '@/redux'

type CountryOption = {
    label: string
    dialCode: string
    value: string
}

const UserProfile = () => {
    const { uuid } = useParams() as { uuid?: string }
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [userProfileToDelete, setUserProfileToDelete] =
        useState<IUserProfile | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isRoleChanging, setIsRoleChanging] = useState(false)

    // Fetch user data
    const {
        data: userData,
        isLoading,
        mutate,
    } = useSWR(
        [`/api/users/${uuid}`, { user_uuid: uuid as string }],
        ([_, params]) =>
            dispatch(
                fetchSingleUserProfileWithArgsAsync(params.user_uuid),
            ).unwrap(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    const dialCodeList = useMemo(() => {
        const newCountryList: Array<CountryOption> = JSON.parse(
            JSON.stringify(countryList),
        )
        return newCountryList.map((country) => {
            country.label = country.dialCode
            return country
        })
    }, [])

    // Formik initialization
    const formik = useFormik<
        IUserProfile & { password?: string; confirmPassword?: string }
    >({
        initialValues: {
            ...(userData || {
                first_name: '',
                last_name: '',
                email: '',
                personal_email: '',
                user_uuid: '',
                branch_uuid: '',
                branch_name: '',
                job_title: '',
                manager_uuid: '',
                hierarchy_uuids: '',
                user_type: '',
                assigned_phone_number: '',
                shared_email: '',
                mobile: '',
                home_phone: '',
                linkedin_profile: '',
                hire_date: '',
                last_day_at_work: '',
                department: '',
                fax: '',
                date_of_birth: '',
                mother_maiden_name: '',
                photo: '',
                signature: '',
                street_address: '',
                unit_or_suite: '',
                city: '',
                province_or_state: '',
                postal_code: '',
                country: '',
                languages_known: '',
                documents: '',
                status: 'ACTIVE',
                role_uuid: '',
                role_value: '',
                password: '',
                confirmPassword: '',
            }),
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            setIsSubmitting(true)
            try {
                const {
                    password,
                    confirmPassword,
                    module_security,
                    ...apiPayload
                } = values

                await dispatch(
                    upsertSingleUserProfileWithCallbackAsync({
                        payload: {
                            ...apiPayload,
                            role_uuid: values.role_uuid,
                            role_value: values.role_value,
                        },
                        onSuccess: (isSuccess) => {
                            if (isSuccess) {
                                mutate()
                                toast.push(
                                    <Notification type="success">
                                        User updated successfully!
                                    </Notification>,
                                    { placement: 'top-center' },
                                )
                                navigate('/app/users')
                            }
                        },
                    }),
                ).unwrap()
            } catch (error) {
                toast.push(
                    <Notification type="danger">
                        Failed to update user
                    </Notification>,
                    { placement: 'top-center' },
                )
            } finally {
                setIsSubmitting(false)
            }
        },
        validate: (values) => {
            const errors: Partial<IUserProfile> = {}

            if (!values.first_name) {
                errors.first_name = 'First name is required'
            }
            if (!values.last_name) {
                errors.last_name = 'Last name is required'
            }
            if (!values.email) {
                errors.email = 'Email is required'
            } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
            ) {
                errors.email = 'Invalid email address'
            }

            return errors
        },
    })

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                if (event.target?.result) {
                    formik.setFieldValue('photo', event.target.result as string)
                }
            }
            reader.readAsDataURL(file)
        }
    }

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
                                    User deleted successfully
                                </Notification>,
                                { placement: 'top-center' },
                            )
                            navigate('/app/users')
                        }
                    },
                }),
            )
        } catch (error) {
            console.error(error)
            toast.push(
                <Notification type="danger">
                    Failed to delete user
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

    const handleBack = () => {
        navigate(-1)
    }

    const parseDate = (dateString: string | undefined): Date | null => {
        if (!dateString) return null
        const [year, month, day] = dateString.split('-')
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    }

    const formatDate = (date: Date | null): string => {
        if (!date) return ''
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const handleRoleChange = async (newValue: IRole) => {
        if (!uuid || !newValue.role_uuid) return

        setIsRoleChanging(true)
        try {
            await api.post('/user/change-user-role', {
                user_uuid: uuid,
                role_uuid: newValue.role_uuid,
                role_value: newValue.role_value,
                status: 'ACTIVE',
            })

            toast.push(
                <Notification type="success">
                    User role updated successfully!
                </Notification>,
                { placement: 'top-center' },
            )
        } catch (error) {
            console.error('Error changing user role:', error)
            toast.push(
                <Notification type="danger">
                    Failed to update user role
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsRoleChanging(false)
        }
    }

    return (
        <>
            {!isLoading && !userData && (
                <div className="h-full flex flex-col items-center justify-center">
                    <NoUserFound height={280} width={280} />
                    <h3 className="mt-8">No user found!</h3>
                </div>
            )}
            {!isLoading && userData && (
                <>
                    <form onSubmit={formik.handleSubmit}>
                        {/* Changed Container to div for better mobile control */}
                        <div className="px-4 sm:px-6 lg:px-8 py-4">
                            <div className="grid gap-4">
                                {/* Personal Information Card - Adjusted padding for mobile */}
                                <Card className="h-full col-span-3 p-4 sm:p-6">
                                    <h4 className="mb-6">
                                        Personal Information
                                    </h4>

                                    <div className="mb-8">
                                        {/* Stacked avatar and buttons vertically on mobile */}
                                        <div className="flex flex-col sm:flex-row items-center gap-4">
                                            <Avatar
                                                size={90}
                                                className="border-4 border-white bg-gray-100 text-gray-300 shadow-lg"
                                                src={formik.values.photo || ''}
                                                name={`${formik.values.first_name} ${formik.values.last_name || ''}`.trim()}
                                            />
                                            {/* Changed button layout for mobile */}
                                            <div className="flex flex-col sm:flex-row items-center gap-2 mt-4 sm:mt-0">
                                                <Upload
                                                    showList={false}
                                                    uploadLimit={1}
                                                    onChange={(files) => {
                                                        if (files.length > 0) {
                                                            const reader =
                                                                new FileReader()
                                                            reader.onload = (
                                                                event,
                                                            ) => {
                                                                if (
                                                                    event.target
                                                                        ?.result
                                                                ) {
                                                                    formik.setFieldValue(
                                                                        'photo',
                                                                        event
                                                                            .target
                                                                            .result as string,
                                                                    )
                                                                }
                                                            }
                                                            reader.readAsDataURL(
                                                                files[0],
                                                            )
                                                        }
                                                    }}
                                                >
                                                    <Button
                                                        variant="solid"
                                                        size="sm"
                                                        type="button"
                                                        icon={<TbPlus />}
                                                        className="w-full sm:w-auto mb-2 sm:mb-0"
                                                    >
                                                        Upload Image
                                                    </Button>
                                                </Upload>
                                                <Button
                                                    size="sm"
                                                    type="button"
                                                    onClick={() => {
                                                        formik.setFieldValue(
                                                            'photo',
                                                            '',
                                                        )
                                                    }}
                                                    className="w-full sm:w-auto"
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Changed grid to single column on mobile */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormItem
                                            label="First Name"
                                            invalid={Boolean(
                                                formik.touched.first_name &&
                                                    formik.errors.first_name,
                                            )}
                                            errorMessage={
                                                formik.errors.first_name
                                            }
                                        >
                                            <Input
                                                name="first_name"
                                                value={formik.values.first_name}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="Last Name"
                                            invalid={Boolean(
                                                formik.touched.last_name &&
                                                    formik.errors.last_name,
                                            )}
                                            errorMessage={
                                                formik.errors.last_name
                                            }
                                        >
                                            <Input
                                                name="last_name"
                                                value={
                                                    formik.values.last_name ||
                                                    ''
                                                }
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                        </FormItem>
                                        <FormItem label="Job Title">
                                            <Input
                                                name="job_title"
                                                value={
                                                    formik.values.job_title ||
                                                    ''
                                                }
                                                onChange={formik.handleChange}
                                            />
                                        </FormItem>
                                        <FormItem label="Date of Birth">
                                            <DatePicker
                                                type="date"
                                                name="date_of_birth"
                                                value={parseDate(
                                                    formik.values
                                                        .date_of_birth || '',
                                                )}
                                                onChange={(date) => {
                                                    if (date) {
                                                        formik.setFieldValue(
                                                            'date_of_birth',
                                                            formatDate(date),
                                                        )
                                                    } else {
                                                        formik.setFieldValue(
                                                            'date_of_birth',
                                                            '',
                                                        )
                                                    }
                                                }}
                                            />
                                        </FormItem>

                                        <FormItem
                                            label="Role"
                                            invalid={Boolean(
                                                formik.touched.role_uuid &&
                                                    formik.errors.role_uuid,
                                            )}
                                            errorMessage={
                                                formik.errors.role_uuid
                                            }
                                        >
                                            <RoleIdAutoSearch
                                                label=""
                                                value={{
                                                    role_uuid:
                                                        formik.values
                                                            .role_uuid || '',
                                                    role_name:
                                                        formik.values
                                                            .role_value || '',
                                                }}
                                                onSelect={async (newValue) => {
                                                    if (newValue.role_uuid) {
                                                        await handleRoleChange(
                                                            newValue,
                                                        )
                                                    }
                                                    formik.setFieldValue(
                                                        'role_uuid',
                                                        newValue.role_uuid,
                                                    )
                                                    formik.setFieldValue(
                                                        'role_value',
                                                        newValue.role_value,
                                                    )
                                                }}
                                                disabled={isRoleChanging}
                                            />
                                        </FormItem>
                                    </div>
                                </Card>

                                {/* Contact Information Card - Adjusted padding */}
                                <Card className="h-full col-span-3 p-4 sm:p-6">
                                    <h4 className="mb-6">
                                        Contact Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormItem
                                            label="Email"
                                            invalid={Boolean(
                                                formik.touched.email &&
                                                    formik.errors.email,
                                            )}
                                            errorMessage={formik.errors.email}
                                        >
                                            <Input
                                                name="email"
                                                value={
                                                    formik.values.email || ''
                                                }
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                        </FormItem>
                                        <FormItem label="Personal Email">
                                            <Input
                                                name="personal_email"
                                                value={
                                                    formik.values
                                                        .personal_email || ''
                                                }
                                                onChange={formik.handleChange}
                                            />
                                        </FormItem>
                                        <FormItem label="Mobile">
                                            <PhoneNumberInput
                                                maxLength={10}
                                                value={
                                                    formik.values.mobile || ''
                                                }
                                                onChange={(value) =>
                                                    formik.setFieldValue(
                                                        'mobile',
                                                        value,
                                                    )
                                                }
                                            />
                                        </FormItem>
                                        <FormItem label="Home Phone">
                                            <PhoneNumberInput
                                                maxLength={10}
                                                value={
                                                    formik.values.home_phone ||
                                                    ''
                                                }
                                                onChange={(value) =>
                                                    formik.setFieldValue(
                                                        'home_phone',
                                                        value,
                                                    )
                                                }
                                            />
                                        </FormItem>
                                        <FormItem label="Mother's Maiden Name">
                                            <Input
                                                name="mother_maiden_name"
                                                value={
                                                    formik.values
                                                        .mother_maiden_name ||
                                                    ''
                                                }
                                                onChange={formik.handleChange}
                                            />
                                        </FormItem>
                                        <FormItem label="LinkedIn Profile">
                                            <Input
                                                name="linkedin_profile"
                                                value={
                                                    formik.values
                                                        .linkedin_profile || ''
                                                }
                                                onChange={formik.handleChange}
                                            />
                                        </FormItem>
                                    </div>
                                </Card>

                                {/* Address Card - Adjusted padding */}
                                <Card className="h-full col-span-3 p-4 sm:p-6">
                                    <h4 className="mb-6">Address Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormItem label="Street Address">
                                            <Input
                                                name="street_address"
                                                value={
                                                    formik.values
                                                        .street_address || ''
                                                }
                                                onChange={formik.handleChange}
                                            />
                                        </FormItem>
                                        <FormItem label="Unit/Suite">
                                            <Input
                                                name="unit_or_suite"
                                                value={
                                                    formik.values
                                                        .unit_or_suite || ''
                                                }
                                                onChange={formik.handleChange}
                                            />
                                        </FormItem>
                                        <FormItem label="City">
                                            <Input
                                                name="city"
                                                value={formik.values.city || ''}
                                                onChange={formik.handleChange}
                                            />
                                        </FormItem>
                                        <FormItem label="Province/State">
                                            <Input
                                                name="province_or_state"
                                                value={
                                                    formik.values
                                                        .province_or_state || ''
                                                }
                                                onChange={formik.handleChange}
                                            />
                                        </FormItem>
                                        <FormItem label="Postal Code">
                                            <Input
                                                name="postal_code"
                                                value={
                                                    formik.values.postal_code ||
                                                    ''
                                                }
                                                onChange={formik.handleChange}
                                            />
                                        </FormItem>
                                        <FormItem label="Country">
                                            <Input
                                                name="country"
                                                value={
                                                    formik.values.country || ''
                                                }
                                                onChange={formik.handleChange}
                                            />
                                        </FormItem>
                                    </div>
                                </Card>

                                {/* Office Information Card - Adjusted padding */}
                                <Card className="h-full col-span-3 p-4 sm:p-6">
                                    <h4 className="mb-6">Office Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormItem label="Hire Date">
                                            <DatePicker
                                                type="date"
                                                name="hire_date"
                                                value={parseDate(
                                                    formik.values.hire_date ||
                                                        '',
                                                )}
                                                onChange={(date) => {
                                                    if (date) {
                                                        formik.setFieldValue(
                                                            'hire_date',
                                                            formatDate(date),
                                                        )
                                                    } else {
                                                        formik.setFieldValue(
                                                            'hire_date',
                                                            '',
                                                        )
                                                    }
                                                }}
                                            />
                                        </FormItem>
                                        <FormItem label="Last Day at Work">
                                            <DatePicker
                                                type="date"
                                                name="last_day_at_work"
                                                value={parseDate(
                                                    formik.values
                                                        .last_day_at_work || '',
                                                )}
                                                onChange={(date) => {
                                                    if (date) {
                                                        formik.setFieldValue(
                                                            'last_day_at_work',
                                                            formatDate(date),
                                                        )
                                                    } else {
                                                        formik.setFieldValue(
                                                            'last_day_at_work',
                                                            '',
                                                        )
                                                    }
                                                }}
                                            />
                                        </FormItem>

                                        <FormItem
                                            label="Branch"
                                            invalid={Boolean(
                                                formik.touched.role_uuid &&
                                                    formik.errors.role_uuid,
                                            )}
                                            errorMessage={
                                                formik.errors.role_uuid
                                            }
                                        >
                                            <UserBranchAutosearch
                                                label=""
                                                value={{
                                                    branch_uuid:
                                                        formik.values
                                                            .branch_uuid || '',
                                                    branch_name:
                                                        formik.values
                                                            .branch_name || '',
                                                }}
                                                onSelect={(newValue) => {
                                                    formik.setFieldValue(
                                                        'role_uuid',
                                                        newValue.branch_uuid,
                                                    )
                                                    formik.setFieldValue(
                                                        'role_value',
                                                        newValue.branch_name,
                                                    )
                                                }}
                                            />
                                        </FormItem>

                                        <FormItem label="Department">
                                            <Input
                                                name="department"
                                                value={
                                                    formik.values.department ||
                                                    ''
                                                }
                                                onChange={formik.handleChange}
                                            />
                                        </FormItem>
                                        <FormItem label="Assigned Phone Number">
                                            <PhoneNumberInput
                                                maxLength={10}
                                                value={
                                                    formik.values
                                                        .assigned_phone_number ||
                                                    ''
                                                }
                                                onChange={(value) =>
                                                    formik.setFieldValue(
                                                        'assigned_phone_number',
                                                        value,
                                                    )
                                                }
                                            />
                                        </FormItem>
                                        <FormItem label="Fax">
                                            <Input
                                                name="fax"
                                                value={formik.values.fax || ''}
                                                onChange={formik.handleChange}
                                            />
                                        </FormItem>
                                        <FormItem label="Shared Email">
                                            <Input
                                                name="shared_email"
                                                value={
                                                    formik.values
                                                        .shared_email || ''
                                                }
                                                onChange={formik.handleChange}
                                            />
                                        </FormItem>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* Bottom action buttons - Adjusted for mobile */}
                        <div className="px-4 sm:px-6 lg:px-8 py-4">
                            <div className="flex flex-col-reverse sm:flex-row items-center justify-between pt-4 gap-4 sm:gap-0">
                                <Button
                                    className="w-full sm:w-auto"
                                    type="button"
                                    variant="plain"
                                    icon={<TbArrowNarrowLeft />}
                                    onClick={handleBack}
                                >
                                    Back
                                </Button>
                                <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-0">
                                    <Button
                                        className="w-full sm:w-auto sm:mr-3"
                                        type="button"
                                        customColorClass={() =>
                                            'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                        }
                                        icon={<TbTrash />}
                                        onClick={() =>
                                            handleDeleteClick(userData)
                                        }
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        className="w-full sm:w-auto"
                                        variant="solid"
                                        type="submit"
                                        loading={isSubmitting}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </>
            )}

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

export default UserProfile

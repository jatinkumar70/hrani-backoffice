/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Form, FormItem } from '@/components/ui/Form'
import { useFormik } from 'formik'
import {
    createNewUserWithCallbackAsync,
    fetchSingleUserProfileWithArgsAsync,
    IUserProfile,
    useAppDispatch,
} from '@/redux'
import { useParams } from 'react-router'
import useSWR from 'swr'
import { Card, Notification, toast } from '@/components/ui'

type PasswordFormValues = {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

const UserSecurity = () => {
    const { uuid } = useParams() as { uuid?: string }
    const dispatch = useAppDispatch()

    const [confirmationOpen, setConfirmationOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Fetch user data
    const { data: userData } = useSWR(
        [`/api/users/${uuid}`, { user_uuid: uuid as string }],
        ([_, params]) =>
            dispatch(
                fetchSingleUserProfileWithArgsAsync(params.user_uuid),
            ).unwrap(),
        { revalidateOnFocus: false },
    )

    // Formik initialization
    const formik = useFormik<PasswordFormValues>({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        onSubmit: (values) => {
            setConfirmationOpen(true)
        },
        validate: (values) => {
            const errors: Partial<IUserProfile> = {}

            if (!values.newPassword) {
                errors.newPassword = 'New Password is required'
            }
            if (!values.currentPassword) {
                errors.password = 'Current Password is required'
            }
            if (!values.confirmPassword) {
                errors.confirmPassword = 'Confirm Password is required'
            }
        },
    })

    const handleConfirmPasswordReset = async () => {
        setIsSubmitting(true)
        try {
            if (!userData?.email) {
                throw new Error('User email not found')
            }

            const payload = {
                email: userData.email,
                user_password: formik.values.newPassword,
                first_name: userData.first_name,
                role_uuid: userData.role_uuid,
                role_value: userData.role_value,
                branch_uuid: userData.branch_uuid,
                branch_name: userData.branch_name,
                user_uuid: userData.user_uuid,
                last_name: userData.last_name || null,
                status: userData.status || 'ACTIVE',
            }

            await dispatch(
                createNewUserWithCallbackAsync({
                    payload,
                    onCallback: (isSuccess) => {
                        if (!isSuccess) {
                            throw new Error('Failed to update password')
                        }
                    },
                }),
            ).unwrap()

            toast.push(
                <Notification type="success">
                    Password updated successfully!
                </Notification>,
                { placement: 'top-center' },
            )

            formik.resetForm()
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    {error instanceof Error
                        ? error.message
                        : 'Failed to update password'}
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setConfirmationOpen(false)
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="md:ml-10 md:mt-4">
            <div className="mb-8 ">
                <h4>Password</h4>
                <p>
                    Remember, your password is your digital key to your account.
                    Keep it safe, keep it secure!
                </p>
            </div>
            <Form onSubmit={formik.handleSubmit}>
                <FormItem
                    label="Current password"
                    invalid={Boolean(
                        formik.touched.currentPassword &&
                            formik.errors.currentPassword,
                    )}
                    errorMessage={formik.errors.currentPassword}
                >
                    <Input
                        type="password"
                        autoComplete="off"
                        placeholder="•••••••••"
                        name="currentPassword"
                        value={formik.values.currentPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </FormItem>
                <FormItem
                    label="New password"
                    invalid={Boolean(
                        formik.touched.newPassword && formik.errors.newPassword,
                    )}
                    errorMessage={formik.errors.newPassword}
                >
                    <Input
                        type="password"
                        autoComplete="off"
                        placeholder="•••••••••"
                        name="newPassword"
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </FormItem>
                <FormItem
                    label="Confirm new password"
                    invalid={Boolean(
                        formik.touched.confirmPassword &&
                            formik.errors.confirmPassword,
                    )}
                    errorMessage={formik.errors.confirmPassword}
                >
                    <Input
                        type="password"
                        autoComplete="off"
                        placeholder="•••••••••"
                        name="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </FormItem>
                <div className="flex justify-end">
                    <Button
                        variant="solid"
                        type="submit"
                        loading={formik.isSubmitting}
                        disabled={!formik.dirty || !formik.isValid}
                    >
                        Update
                    </Button>
                </div>
            </Form>
            <ConfirmDialog
                isOpen={confirmationOpen}
                type="warning"
                title="Update password"
                confirmButtonProps={{
                    loading: isSubmitting,
                    onClick: handleConfirmPasswordReset,
                }}
                onClose={() => setConfirmationOpen(false)}
                onRequestClose={() => setConfirmationOpen(false)}
                onCancel={() => setConfirmationOpen(false)}
            >
                <p>Are you sure you want to change your password?</p>
            </ConfirmDialog>
            {/* <div className="mb-8">
                <h4>2-Step verification</h4>
                <p>
                    Your account holds great value to hackers. Enable two-step
                    verification to safeguard your account!
                </p>
                <div className="mt-8">
                    {authenticatorList.map((authOption, index) => (
                        <div
                            key={authOption.value}
                            className={classNames(
                                'py-6 border-gray-200 dark:border-gray-600',
                                !isLastChild(authenticatorList, index) &&
                                    'border-b',
                            )}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <Avatar
                                        size={35}
                                        className="bg-transparent"
                                        src={authOption.img}
                                    />
                                    <div>
                                        <h6>{authOption.label}</h6>
                                        <span>{authOption.desc}</span>
                                    </div>
                                </div>
                                <div>
                                    {selected2FaType === authOption.value ? (
                                        <Button
                                            size="sm"
                                            customColorClass={() =>
                                                'border-success ring-1 ring-success text-success hover:border-success hover:ring-success hover:text-success bg-transparent'
                                            }
                                            onClick={() =>
                                                setSelected2FaType('')
                                            }
                                        >
                                            Activated
                                        </Button>
                                    ) : (
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                setSelected2FaType(
                                                    authOption.value,
                                                )
                                            }
                                        >
                                            Enable
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div> */}
        </Card>
    )
}

export default UserSecurity

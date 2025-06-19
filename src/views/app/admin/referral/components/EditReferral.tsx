import NoDataFound from '@/assets/svg/NoDataFound'
import { ConfirmDialog, Container } from '@/components/shared'
import { Button, Notification, toast } from '@/components/ui'
import {
    fetchSingleReferralAsync,
    updateReferralAsync,
} from '@/redux/child-reducers/referral/referral.actions'
import { IReferral } from '@/redux/child-reducers/referral/referral.types'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { TbArrowNarrowLeft, TbTrash } from 'react-icons/tb'
import { useNavigate, useParams } from 'react-router'
import useSWR from 'swr'
import { useAppDispatch } from '@/redux'

import { FormItem } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import { statusOptions, typeOptions } from './Constants'

const EditReferral = () => {
    const { bni_clicks_uuid } = useParams() as { bni_clicks_uuid?: string }
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDelete, setIsDeleting] = useState(false)

    // Fetch referral data
    const {
        data: referralData,
        isLoading,
        mutate,
    } = useSWR(
        [
            `/api/referrals/${bni_clicks_uuid}`,
            { bni_clicks_uuid: bni_clicks_uuid as string },
        ],
        ([_, params]) =>
            dispatch(fetchSingleReferralAsync(params.bni_clicks_uuid)).unwrap(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    // Formik initialization
    const formik = useFormik<IReferral>({
        initialValues: {
            ...(referralData || {
                bni_clicks_uuid: '',
                type: 'CLICK',
                referral: '',
                ip: '',
                status: 'ACTIVE',
                created_by_uuid: null,
                created_by_name: null,
                modified_by_uuid: null,
                modified_by_name: null,
            }),
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            setIsSubmitting(true)
            try {
                // Exclude create_ts from payload
                const { create_ts, ...payload } = values

                await dispatch(
                    updateReferralAsync({
                        payload: payload,
                        onSuccess: (isSuccess) => {
                            if (isSuccess) {
                                mutate()
                                toast.push(
                                    <Notification type="success">
                                        Referral updated successfully!
                                    </Notification>,
                                    { placement: 'top-center' },
                                )
                                navigate('/app/admin/referrals')
                            }
                        },
                    }),
                ).unwrap()
            } catch (error) {
                toast.push(
                    <Notification type="danger">
                        Failed to update referral
                    </Notification>,
                    { placement: 'top-center' },
                )
            } finally {
                setIsSubmitting(false)
            }
        },

        validate: (values) => {
            const errors: Partial<IReferral> = {}

            if (!values.type) {
                errors.type = 'Type is required'
            }
            if (!values.ip) {
                errors.ip = 'IP address is required'
            }

            return errors
        },
    })

    const handleDeleteClick = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!referralData) return
        setIsDeleting(true)

        try {
            await dispatch(
                updateReferralAsync({
                    payload: {
                        ...referralData,
                        status: 'INACTIVE',
                        bni_clicks_uuid: referralData.bni_clicks_uuid,
                    },
                    onSuccess: (isSuccess) => {
                        if (isSuccess) {
                            toast.push(
                                <Notification type="success">
                                    Referral deleted successfully
                                </Notification>,
                                { placement: 'top-center' },
                            )
                            navigate('/app/admin/referrals')
                        }
                    },
                }),
            ).unwrap()
        } catch (error) {
            console.error(error)
            toast.push(
                <Notification type="danger">
                    Failed to delete referral
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setDeleteConfirmationOpen(false)
            setIsDeleting(false)
        }
    }

    const handleCancelDelete = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleBack = () => {
        navigate(-1)
    }

    return (
        <>
            {!isLoading && !referralData && (
                <div className="h-full flex flex-col items-center justify-center">
                    <NoDataFound height={280} width={280} />
                    <h3 className="mt-8">No referral found!</h3>
                </div>
            )}
            {!isLoading && referralData && (
                <form onSubmit={formik.handleSubmit}>
                    <Container className="flex-grow">
                        <div className="grid gap-4 ">
                            <Card className="h-full col-span-3 p-4">
                                <h3>Edit Referral</h3>

                                <div className="grid md:grid-cols-2 gap-4 pt-8">
                                    <FormItem
                                        label="Type"
                                        invalid={Boolean(
                                            formik.touched.type &&
                                                formik.errors.type,
                                        )}
                                        errorMessage={formik.errors.type}
                                    >
                                        <Select
                                            name="type"
                                            options={typeOptions}
                                            value={typeOptions.find(
                                                (option) =>
                                                    option.value ===
                                                    formik.values.type,
                                            )}
                                            onChange={(selected) =>
                                                formik.setFieldValue(
                                                    'type',
                                                    selected?.value,
                                                )
                                            }
                                        />
                                    </FormItem>
                                    <FormItem
                                        label="Referral"
                                        invalid={Boolean(
                                            formik.touched.referral &&
                                                formik.errors.referral,
                                        )}
                                        errorMessage={formik.errors.referral}
                                    >
                                        <Input
                                            name="referral"
                                            value={formik.values.referral || ''}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    </FormItem>
                                    <FormItem
                                        label="IP Address"
                                        invalid={Boolean(
                                            formik.touched.ip &&
                                                formik.errors.ip,
                                        )}
                                        errorMessage={formik.errors.ip}
                                    >
                                        <Input
                                            name="ip"
                                            value={formik.values.ip}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    </FormItem>
                                    <FormItem label="Status">
                                        <Select
                                            name="status"
                                            options={statusOptions}
                                            value={statusOptions.find(
                                                (option) =>
                                                    option.value ===
                                                    formik.values.status,
                                            )}
                                            onChange={(selected) =>
                                                formik.setFieldValue(
                                                    'status',
                                                    selected?.value,
                                                )
                                            }
                                        />
                                    </FormItem>
                                </div>

                                <Container>
                                    <div className="flex items-center justify-between pt-8">
                                        <Button
                                            className="ltr:mr-3 rtl:ml-3"
                                            type="button"
                                            variant="plain"
                                            icon={<TbArrowNarrowLeft />}
                                            onClick={handleBack}
                                        >
                                            Back
                                        </Button>
                                        <div className="flex items-center">
                                            <Button
                                                className="ltr:mr-3 rtl:ml-3"
                                                type="button"
                                                customColorClass={() =>
                                                    'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                                }
                                                icon={<TbTrash />}
                                                onClick={handleDeleteClick}
                                            >
                                                Delete
                                            </Button>
                                            <Button
                                                variant="solid"
                                                type="submit"
                                                loading={isSubmitting}
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    </div>
                                </Container>
                            </Card>
                        </div>
                    </Container>
                </form>
            )}

            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Delete Referral"
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

export default EditReferral

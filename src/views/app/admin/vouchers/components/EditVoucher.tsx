import NoVoucherFound from '@/assets/svg/NoUserFound'
import { ConfirmDialog, Container } from '@/components/shared'
import { Button, Notification, toast } from '@/components/ui'
import {
    fetchSingleVoucherAsync,
    fetchVouchersAsync,
    updateVoucherAsync,
} from '@/redux/child-reducers/voucher/voucher.actions'
import { IVoucher } from '@/redux/child-reducers/voucher/voucher.types'
import { useFormik } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import { TbArrowNarrowLeft, TbTrash } from 'react-icons/tb'
import { useNavigate, useParams } from 'react-router'
import useSWR from 'swr'
import { useAppDispatch } from '@/redux'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import { FormItem } from '@/components/ui/Form'
import { Input } from '@/components/ui/Input'
import { Option, Select } from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import { DatePicker } from '@/components/ui/DatePicker'
import moment from 'moment'
import { Voucher } from '../types'
import { discountOptions, statusOptions, labelOptions } from './Constants'

const EditVoucher = () => {
    const { voucher_uuid } = useParams() as { voucher_uuid?: string }
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDelete, setIsDeleting] = useState(false)

    // Fetch voucher data
    const {
        data: voucherData,
        isLoading,
        mutate,
    } = useSWR(
        [
            `/api/vouchers/${voucher_uuid}`,
            { voucher_uuid: voucher_uuid as string },
        ],
        ([_, params]) =>
            dispatch(fetchSingleVoucherAsync(params.voucher_uuid)).unwrap(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    // Formik initialization
    const formik = useFormik<IVoucher>({
        initialValues: {
            ...(voucherData || {
                voucher_uuid: '',
                voucher_code: '',
                label: '',
                discount_type: 'PERCENTAGE',
                amount: 0,
                max_limit: 0,
                status: 'ACTIVE',
                description: '',
                created_at: '',
                updated_at: '',
            }),
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            setIsSubmitting(true)
            try {
                await dispatch(
                    updateVoucherAsync({
                        payload: values,
                        onSuccess: (isSuccess) => {
                            if (isSuccess) {
                                mutate()
                                toast.push(
                                    <Notification type="success">
                                        Voucher updated successfully!
                                    </Notification>,
                                    { placement: 'top-center' },
                                )
                                navigate('/app/admin/vouchers')
                            }
                        },
                    }),
                ).unwrap()
            } catch (error) {
                toast.push(
                    <Notification type="danger">
                        Failed to update voucher
                    </Notification>,
                    { placement: 'top-center' },
                )
            } finally {
                setIsSubmitting(false)
            }
        },
        validate: (values) => {
            const errors: Partial<IVoucher> = {}

            if (!values.voucher_code) {
                errors.voucher_code = 'Voucher code is required'
            }
            if (!values.label) {
                errors.label = 'Label is required'
            }
            if (values.amount <= 0) {
                errors.amount = 'Amount must be greater than 0'
            }
            if (values.discount_type === 'PERCENTAGE' && values.amount > 100) {
                errors.amount = 'Percentage discount cannot exceed 100%'
            }

            return errors
        },
    })

    const handleDeleteClick = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!voucherData) return

        try {
            await dispatch(
                updateVoucherAsync({
                    payload: { ...voucherData, status: 'DELETE' },
                    onSuccess: (isSuccess) => {
                        if (isSuccess) {
                            toast.push(
                                <Notification type="success">
                                    Voucher deleted successfully
                                </Notification>,
                                { placement: 'top-center' },
                            )
                            navigate('/app/admin/vouchers')
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
            {!isLoading && !voucherData && (
                <div className="h-full flex flex-col items-center justify-center">
                    <NoVoucherFound height={280} width={280} />
                    <h3 className="mt-8">No voucher found!</h3>
                </div>
            )}
            {!isLoading && voucherData && (
                <form onSubmit={formik.handleSubmit}>
                    <Container className="flex-grow">
                        <div className="grid gap-4 ">
                            <Card className="h-full col-span-3 p-4">
                                <h3>Edit Promo Code</h3>

                                <div className="grid md:grid-cols-2 gap-4 pt-8">
                                    <FormItem
                                        label="Voucher Code"
                                        invalid={Boolean(
                                            formik.touched.voucher_code &&
                                                formik.errors.voucher_code,
                                        )}
                                        errorMessage={
                                            formik.errors.voucher_code
                                        }
                                    >
                                        <Input
                                            name="voucher_code"
                                            value={formik.values.voucher_code}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    </FormItem>
                                    <FormItem
                                        label="Label"
                                        invalid={Boolean(
                                            formik.touched.label &&
                                                formik.errors.label,
                                        )}
                                        errorMessage={formik.errors.label}
                                    >
                                        <Select
                                            name="label"
                                            options={labelOptions}
                                            value={labelOptions.find(
                                                (option) =>
                                                    option.value ===
                                                    formik.values.label,
                                            )}
                                            onChange={(labelOptions) =>
                                                formik.setFieldValue(
                                                    'label',
                                                    labelOptions?.value,
                                                )
                                            }
                                        />
                                    </FormItem>
                                    <FormItem
                                        label="Description"
                                        invalid={Boolean(
                                            formik.touched.description &&
                                                formik.errors.description,
                                        )}
                                        errorMessage={formik.errors.description}
                                    >
                                        <Input
                                            name="description"
                                            value={
                                                formik.values.description || ''
                                            }
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    </FormItem>
                                    {/* <FormItem label="Discount Type">
                                            <Select
                                                name="discount_type"
                                                value={formik.values.discount_type}
                                                onChange={formik.handleChange}
                                            >
                                                <Select.Option value="PERCENTAGE">Percentage</Select.Option>
                                                <Select.Option value="FIXED">Fixed Amount</Select.Option>
                                            </Select>
                                        </FormItem> */}

                                    <FormItem label="Discount Type">
                                        <Select
                                            name="discount_type"
                                            options={discountOptions}
                                            value={discountOptions.find(
                                                (option) =>
                                                    option.value ===
                                                    formik.values.discount_type,
                                            )}
                                            onChange={(discountOptions) =>
                                                formik.setFieldValue(
                                                    'discount_type',
                                                    discountOptions?.value,
                                                )
                                            }
                                        />
                                    </FormItem>

                                    <FormItem
                                        label={
                                            formik.values.discount_type ===
                                            'PERCENTAGE'
                                                ? 'Amount %'
                                                : 'Amount'
                                        }
                                        invalid={Boolean(
                                            formik.touched.amount &&
                                                formik.errors.amount,
                                        )}
                                        errorMessage={formik.errors.amount}
                                    >
                                        <Input
                                            type="number"
                                            name="amount"
                                            value={formik.values.amount}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    </FormItem>
                                    <FormItem label="Max Usage Limit">
                                        <Input
                                            type="number"
                                            name="max_limit"
                                            value={formik.values.max_limit}
                                            onChange={formik.handleChange}
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
                                            onChange={(selectedOption) =>
                                                formik.setFieldValue(
                                                    'status',
                                                    selectedOption?.value,
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
                                                onClick={() =>
                                                    handleDeleteClick()
                                                }
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
        </>
    )
}

export default EditVoucher

import { useEffect, useState } from 'react'
import { FormItem, Form } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import { createVoucherAsync } from '@/redux/child-reducers/voucher/voucher.actions'
import { IVoucher, useAppDispatch } from '@/redux'
import { statusOptions, discountOptions, labelOptions } from './Constants'

type FormSchema = {
    voucher_code: string
    label: string
    description?: string
    discount_type: 'PERCENTAGE' | 'FIXED'
    amount: number
    max_limit?: number
    status: 'ACTIVE' | 'INACTIVE'
}

const validationSchema: ZodType<FormSchema> = z
    .object({
        voucher_code: z
            .string()
            .min(1, { message: 'Voucher code is required' }),
        label: z.string().min(1, { message: 'Label is required' }),
        description: z.string().optional(),
        discount_type: z.enum(['PERCENTAGE', 'FIXED']),
        amount: z
            .number()
            .min(0.01, { message: 'Amount must be greater than 0' }),
        max_limit: z.number().min(0).optional(),
        status: z.enum(['ACTIVE', 'INACTIVE']),
    })
    .refine(
        (data) =>
            data.discount_type !== 'PERCENTAGE' ||
            (data.discount_type === 'PERCENTAGE' && data.amount <= 100),
        {
            message: 'Percentage discount cannot exceed 100%',
            path: ['amount'],
        },
    )

const NewVoucherForm = ({ onClose }: { onClose: () => void }) => {
    const dispatch = useAppDispatch()
    const [isSubmitting, setSubmitting] = useState(false)
    const [amountLabel, setAmountLabel] = useState('Amount')

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
        watch,
    } = useForm<FormSchema>({
        defaultValues: {
            voucher_code: '',
            label: '',
            description: '',
            discount_type: undefined,
            amount: undefined,
            max_limit: 0,
            status: 'ACTIVE',
        },
        resolver: zodResolver(validationSchema),
    })

    const discountType = watch('discount_type')

    useEffect(() => {
        setAmountLabel(discountType === 'PERCENTAGE' ? 'Amount %' : 'Amount')
    }, [discountType])

    const onSubmit = async (formData: FormSchema) => {
        setSubmitting(true)

        const voucherData: IVoucher = {
            voucher_code: formData.voucher_code,
            label: formData.label,
            description: formData.description || '',
            discount_type: formData.discount_type,
            amount: formData.amount,
            max_limit: formData.max_limit,
            status: formData.status,
            voucher_uuid: '',
            // created_at: new Date().toISOString(),
            // updated_at: new Date().toISOString(),
        }

        try {
            await dispatch(createVoucherAsync(voucherData)).unwrap()
            onClose()
            reset()
        } catch (error) {
            console.error('Failed to create voucher:', error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label="Promo Code"
                    invalid={Boolean(errors.voucher_code)}
                    errorMessage={errors.voucher_code?.message}
                >
                    <Controller
                        name="voucher_code"
                        control={control}
                        render={({ field }) => (
                            <Input type="text" autoComplete="off" {...field} />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Label"
                    invalid={Boolean(errors.label)}
                    errorMessage={errors.label?.message}
                >
                    <Controller
                        name="label"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Select label"
                                options={labelOptions}
                                value={labelOptions.find(
                                    (option) => option.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Description"
                    invalid={Boolean(errors.description)}
                    errorMessage={errors.description?.message}
                >
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <Input type="text" autoComplete="off" {...field} />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Discount Type"
                    invalid={Boolean(errors.discount_type)}
                    errorMessage={errors.discount_type?.message}
                >
                    <Controller
                        name="discount_type"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Select discount type"
                                options={discountOptions}
                                value={discountOptions.find(
                                    (option) => option.value === field.value,
                                )}
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label={amountLabel}
                    invalid={Boolean(errors.amount)}
                    errorMessage={errors.amount?.message}
                >
                    <Controller
                        name="amount"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="number"
                                autoComplete="off"
                                {...field}
                                onChange={(e) =>
                                    field.onChange(parseFloat(e.target.value))
                                }
                            />
                        )}
                    />
                </FormItem>

                {discountType === 'FIXED' ? (
                    <></>
                ) : (
                    <FormItem
                        label="Max Usage Limit"
                        invalid={Boolean(errors.max_limit)}
                        errorMessage={errors.max_limit?.message}
                    >
                        <Controller
                            name="max_limit"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="number"
                                    autoComplete="off"
                                    {...field}
                                    onChange={(e) =>
                                        field.onChange(parseInt(e.target.value))
                                    }
                                />
                            )}
                        />
                    </FormItem>
                )}

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
                                onChange={(option) =>
                                    field.onChange(option?.value)
                                }
                            />
                        )}
                    />
                </FormItem> */}
            </div>

            <div className="flex justify-end gap-2 mt-6">
                <Button variant="plain" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="solid" type="submit" loading={isSubmitting}>
                    Create Promo Code
                </Button>
            </div>
        </Form>
    )
}

export default NewVoucherForm

import { useEffect, useState } from 'react'
import { FormItem, Form } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import { IReferral, useAppDispatch } from '@/redux'
import { statusOptions, typeOptions } from './Constants'

type FormSchema = {
    type: string
    referral?: string
    ip: string
    status: 'ACTIVE' | 'INACTIVE'
}

const validationSchema: ZodType<FormSchema> = z.object({
    type: z.string().min(1, { message: 'Type is required' }),
    referral: z.string().optional(),
    ip: z.string().min(1, { message: 'IP address is required' }),
    status: z.enum(['ACTIVE', 'INACTIVE']),
})

const NewReferralForm = ({ onClose }: { onClose: () => void }) => {
    const dispatch = useAppDispatch()
    const [isSubmitting, setSubmitting] = useState(false)

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<FormSchema>({
        defaultValues: {
            type: 'CLICK',
            referral: '',
            ip: '',
            status: 'ACTIVE',
        },
        resolver: zodResolver(validationSchema),
    })

    const onSubmit = async (formData: FormSchema) => {
        setSubmitting(true)

        const referralData: IReferral = {
            type: formData.type,
            referral: formData.referral || null,
            ip: formData.ip,
            status: formData.status,
            bni_clicks_uuid: '',
            created_by_uuid: null,
            created_by_name: null,
            modified_by_uuid: null,
            modified_by_name: null,
            create_ts: new Date().toISOString(),
        }

        try {
            await dispatch(createReferralAsync(referralData)).unwrap()
            onClose()
            reset()
        } catch (error) {
            console.error('Failed to create referral:', error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label="Type"
                    invalid={Boolean(errors.type)}
                    errorMessage={errors.type?.message}
                >
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <Select
                                placeholder="Select type"
                                options={typeOptions}
                                value={typeOptions.find(
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
                    label="Referral"
                    invalid={Boolean(errors.referral)}
                    errorMessage={errors.referral?.message}
                >
                    <Controller
                        name="referral"
                        control={control}
                        render={({ field }) => (
                            <Input type="text" autoComplete="off" {...field} />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="IP Address"
                    invalid={Boolean(errors.ip)}
                    errorMessage={errors.ip?.message}
                >
                    <Controller
                        name="ip"
                        control={control}
                        render={({ field }) => (
                            <Input type="text" autoComplete="off" {...field} />
                        )}
                    />
                </FormItem>

                <FormItem
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
                </FormItem>
            </div>

            <div className="flex justify-end gap-2 mt-6">
                <Button variant="plain" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="solid" type="submit" loading={isSubmitting}>
                    Create Referral
                </Button>
            </div>
        </Form>
    )
}

export default NewReferralForm

import classNames from 'classnames'
import { useConfig } from '../ConfigProvider'
import { useForm, useFormItem } from '../Form/context'
import { useInputGroup } from '../InputGroup/context'
import { CONTROL_SIZES } from '../utils/constants'
import type { CommonProps, TypeAttributes } from '../@types/common'
import type { Ref } from 'react'

export interface PhoneNumberInputProps extends CommonProps {
    value?: string
    onChange?: (value: string) => void
    disabled?: boolean
    invalid?: boolean
    size?: TypeAttributes.ControlSize
    ref?: Ref<HTMLInputElement>
    maxLength?: number
}

const PhoneNumberInput = (props: PhoneNumberInputProps) => {
    const {
        value = '',
        onChange,
        className,
        disabled,
        invalid,
        size,
        ref,
        maxLength = 10,
        ...rest
    } = props

    const { controlSize } = useConfig()
    const formControlSize = useForm()?.size
    const formItemInvalid = useFormItem()?.invalid
    const inputGroupSize = useInputGroup()?.size

    const inputSize = size || inputGroupSize || formControlSize || controlSize
    const isInputInvalid = invalid || formItemInvalid

    const inputDefaultClass = 'input'
    const inputSizeClass = `input-${inputSize} h-${CONTROL_SIZES[inputSize].h}`
    const inputFocusClass = `focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary`
    const inputClass = classNames(
        inputDefaultClass,
        inputSizeClass,
        !isInputInvalid && inputFocusClass,
        className,
        disabled && 'input-disabled',
        isInputInvalid && 'input-invalid',
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value
        // Allow only numbers
        const sanitizedValue = input.replace(/\D/g, '')
        // Limit to maxLength digits
        const limitedValue = sanitizedValue.slice(0, maxLength)
        onChange?.(limitedValue)
    }

    return (
        <input
            ref={ref}
            type="tel"
            className={inputClass}
            value={value}
            disabled={disabled}
            onChange={handleChange}
            maxLength={maxLength}
            {...rest}
        />
    )
}

export default PhoneNumberInput

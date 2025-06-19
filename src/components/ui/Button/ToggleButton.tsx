import classNames from '../utils/classNames'
import { useConfig } from '../ConfigProvider'
import type { CommonProps } from '../@types/common'
import type { MouseEvent } from 'react'

export interface ToggleButtonProps extends CommonProps {
    size?: 'sm' | 'lg'
    value?: boolean
    onChange?: (value: boolean) => void
    activeText?: string
    inactiveText?: string
    disabled?: boolean
}

const ToggleButton = (props: ToggleButtonProps) => {
    const {
        size = 'lg',
        value = false,
        onChange,
        activeText = 'Active',
        inactiveText = 'Inactive',
        disabled = false,
        className,
    } = props

    const { ui } = useConfig()

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (!disabled && onChange) {
            onChange(!value)
        }
    }

    // Base classes
    const baseClasses = classNames(
        'relative inline-flex items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
        'focus:outline-none focus:ring-0', // Removed focus ring
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className,
    )

    // Size classes - adjusted for better mobile responsiveness
    const sizeClasses = {
        sm: classNames(
            'h-8 w-[6rem]', // Adjusted width for mobile
            value ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600',
        ),
        lg: classNames(
            'h-8 w-[6rem]', // Same size for consistency
            value ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600',
        ),
    }

    // Toggle circle classes - adjusted positions
    const toggleClasses = {
        sm: classNames(
            'absolute h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out',
            value ? 'translate-x-[4rem]' : 'translate-x-1', // Adjusted for mobile
        ),
        lg: classNames(
            'absolute h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out',
            value ? 'translate-x-[4rem]' : 'translate-x-1', // Same for consistency
        ),
    }

    // Text classes - adjusted for better mobile visibility
    const textClasses = {
        sm: classNames(
            'absolute text-xs text-white font-medium transition-opacity duration-200',
            value ? 'left-2 opacity-100' : 'right-2 opacity-0',
        ),
        lg: classNames(
            'absolute text-sm text-white font-medium transition-opacity duration-200',
            value ? 'left-2 opacity-100' : 'right-2 opacity-0',
        ),
    }

    // Inactive text classes
    const inactiveTextClasses = {
        sm: classNames(
            'absolute text-xs text-white font-medium transition-opacity duration-200',
            value ? 'left-2 opacity-0' : 'right-2 opacity-100',
        ),
        lg: classNames(
            'absolute text-sm text-white font-medium transition-opacity duration-200',
            value ? 'left-2 opacity-0' : 'right-2 opacity-100',
        ),
    }

    return (
        <button
            type="button"
            role="switch"
            aria-checked={value}
            className={classNames(baseClasses, sizeClasses[size])}
            disabled={disabled}
            onClick={handleClick}
        >
            {/* Active text (visible when active) */}
            <span className={classNames(textClasses[size])}>{activeText}</span>

            {/* Inactive text (visible when inactive) */}
            <span className={classNames(inactiveTextClasses[size])}>
                {inactiveText}
            </span>

            {/* Toggle circle */}
            <span
                className={classNames(toggleClasses[size])}
                aria-hidden="true"
            />

            {/* Screen reader only text */}
            <span className="sr-only">{value ? activeText : inactiveText}</span>
        </button>
    )
}

export default ToggleButton

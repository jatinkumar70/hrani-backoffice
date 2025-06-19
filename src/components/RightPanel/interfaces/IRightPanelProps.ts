import React from 'react'

export interface IRightPanelProps {
    open: boolean
    heading: string
    width?: string
    mobileWidth?: string
    subHeading?: string
    isWrappedWithForm?: boolean
    onFormSubmit?: (e: React.FormEvent) => void
    actionButtons?: () => React.ReactNode
    children?: React.ReactNode
    rightHeading?: () => React.ReactNode
    onClose?: () => void
}

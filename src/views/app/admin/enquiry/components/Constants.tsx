import { ISelectOption } from '@/types'

export const operatorOptions: ISelectOption[] = [
    { value: 'EQUAL', label: 'Equals' },
    { value: 'NOT_EQUAL', label: 'Not Equals' },
    { value: 'GREATER', label: 'Greater Than' },
    { value: 'LESSER', label: 'Less Than' },
    { value: 'GREATER_THAN_EQUAL', label: 'Greater Than or Equal' },
    { value: 'LESSER_THAN_EQUAL', label: 'Less Than or Equal' },
    { value: 'CONTAINS', label: 'Contains' },
    { value: 'STARTS_WITH', label: 'Starts With' },
    { value: 'ENDS_WITH', label: 'Ends With' },
    { value: 'DATE_RANGE', label: 'Date Range' },
    { value: 'IN', label: 'In List' },
]

export const logicalOperatorOptions: ISelectOption[] = [
    { value: 'AND', label: 'AND' },
    { value: 'OR', label: 'OR' },
]

export const columnOptions: ISelectOption[] = [
    { value: 'status', label: 'Status', type: 'select' },
    { value: 'name', label: 'Name', type: 'text' },
    { value: 'property_location', label: 'Property Location', type: 'text' },
    { value: 'phone', label: 'Phone', type: 'number' },
    { value: 'email', label: 'Email', type: 'text' },
    { value: 'insert_ts', label: 'Enquiry Date', type: 'date' },
]

export const statusOptions: ISelectOption[] = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
]

export const quickSearchFields = [
    { name: 'name', label: 'Guest Name', type: 'text' as const },
    { name: 'property_location', label: 'Property Location', type: 'text' as const },
    { name: 'referralCode', label: 'Referral Code', type: 'text' as const },
    { name: 'phone', label: 'Phone', type: 'number' as const },
    { name: 'email', label: 'Email', type: 'text' as const },
    { name: 'insert_ts', label: 'Enquiry Date', type: 'date' as const },
    {
        name: 'status',
        label: 'Status',
        type: 'select' as const,
        options: statusOptions,
    },
]

export const operatorOptions = [
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

export const logicalOperatorOptions = [
    { value: 'AND', label: 'AND' },
    { value: 'OR', label: 'OR' },
]

export const columnOptions = [
    { value: 'status', label: 'Status', type: 'select' },
    { value: 'voucher_code', label: 'Promo Code', type: 'text' },
    { value: 'discount_type', label: 'Discount Type', type: 'select' },
    { value: 'amount', label: 'Amount', type: 'number' },
    { value: 'max_limit', label: 'Max Limit', type: 'number' },
    { value: 'label', label: 'Label', type: 'select' },
]

export const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
]

export const discountOptions = [
    { value: 'PERCENTAGE', label: 'Percentage' },
    { value: 'FIXED', label: 'Fixed' },
]
export const labelOptions = [
    { value: 'accommodation_fee', label: 'Accommodation Fee' },
    { value: 'cleaning_fee', label: 'Cleaning Fee' },
    { value: 'damage_waiver', label: 'Damage Waiver' },
    { value: 'tourism_fee', label: 'Tourism Fee' },
    { value: 'service_fee', label: 'Service Fee' },
    { value: 'pet_charges', label: 'Pet Charges' },
    { value: 'vat', label: 'VAT' },
]

export const quickSearchFields = [
    { name: 'voucher_code', label: 'Promo Code', type: 'text' as const },
    { name: 'amount', label: 'Amount', type: 'number' as const },
    { name: 'max_limit', label: 'Max Limit', type: 'number' as const },

    {
        name: 'status',
        label: 'Status',
        type: 'select' as const,
        options: statusOptions,
    },
    {
        name: 'discount_type',
        label: 'Discount Type',
        type: 'select' as const,
        options: discountOptions,
    },
    {
        name: 'label',
        label: 'Label',
        type: 'select' as const,
        options: labelOptions,
    },
]

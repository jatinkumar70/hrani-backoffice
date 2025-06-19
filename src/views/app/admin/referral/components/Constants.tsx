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
    { value: 'type', label: 'Type', type: 'text' },
    { value: 'referral', label: 'Referral', type: 'text' },
    { value: 'ip', label: 'IP Address', type: 'text' },
    { value: 'created_by_name', label: 'Created By', type: 'text' },
]

export const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
]

export const typeOptions = [
    { value: 'List Your Property', label: 'List Your Property' },
    { value: 'Make a Reservation', label: 'Make a Reservation' },
    { value: 'BniHomepage', label: 'BniHomepage' },
    { value: 'LIST', label: 'LIST' },
    { value: 'bnibni', label: 'bnibni' },
    { value: 'CLICK', label: 'Click' },
    { value: 'IMPRESSION', label: 'Impression' },
]

export const quickSearchFields = [
    { name: 'type', label: 'Type', type: 'text' as const },
    { name: 'referral', label: 'Referral', type: 'text' as const },
    { name: 'ip', label: 'IP Address', type: 'text' as const },
    // { name: 'create_ts', label: 'Created A', type: 'date' },
    {
        name: 'status',
        label: 'Status',
        type: 'select' as const,
        options: statusOptions,
    },
    {
        name: 'type',
        label: 'Type',
        type: 'select' as const,
        options: typeOptions,
    },
]

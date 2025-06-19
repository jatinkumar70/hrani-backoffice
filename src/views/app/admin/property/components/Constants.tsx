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
]

export const logicalOperatorOptions = [
    { value: 'AND', label: 'AND' },
    { value: 'OR', label: 'OR' },
]

export const columnOptions = [
    { value: 'property_details_name', label: 'Property Name', type: 'text' },
    { value: 'id', label: 'Property ID', type: 'text' },
    { value: 'property_city', label: 'City', type: 'text' },
    { value: 'area', label: 'Area', type: 'text' },
    { value: 'property_type', label: 'Property Type', type: 'text' },
    { value: 'status', label: 'Status', type: 'select' },
    { value: 'bedrooms', label: 'Bedrooms', type: 'select' },
    { value: 'bathroom_full', label: 'Bathrooms', type: 'select' },
    { value: 'max_occupancy', label: 'Max Occupancy', type: 'number' },
]

export const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
]

export const bedroomsOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
]

export const bathroomsOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
]

export const quickSearchFields = [
    { name: 'property_details_name', label: 'Property Name', type: 'text' as const },
    { name: 'id', label: 'Property ID', type: 'text' as const },
    { name: 'property_city', label: 'City', type: 'text' as const },
    { name: 'area', label: 'Area', type: 'text' as const },
    { name: 'property_type', label: 'Property Type', type: 'text' as const },
    { name: 'max_occupancy', label: 'Max Occupancy', type: 'number' as const },
    {
        name: 'bedrooms',
        label: 'Bedrooms',
        type: 'select' as const,
        options: bedroomsOptions,
    },
    {
        name: 'bathroom_full',
        label: 'Bathrooms',
        type: 'select' as const,
        options: bathroomsOptions,
    },
    {
        name: 'status',
        label: 'Status',
        type: 'select' as const,
        options: statusOptions,
    },
]

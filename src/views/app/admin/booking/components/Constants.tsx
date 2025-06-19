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
    { value: 'user_name', label: 'Guest Name', type: 'text' },
    { value: 'property_details_name', label: 'Property Name', type: 'text' },
    { value: 'from_date', label: 'Check-in Date', type: 'date' },
    { value: 'to_date', label: 'Check-out Date', type: 'date' },
    { value: 'payment_status', label: 'Payment Status', type: 'text' },
    { value: 'mobile', label: 'Mobile', type: 'number' },
    { value: 'beds_id', label: 'Beds ID', type: 'number' },
    { value: 'no_of_guests', label: 'Number of Guests', type: 'number' },
    { value: 'total_price', label: 'Total Price', type: 'number' },
    { value: 'booking_source', label: 'Booking Source', type: 'text' },
    { value: 'email', label: 'Email', type: 'text' },
    { value: 'is_refundable', label: 'Package Type', type: 'text' },
    { value: 'order_id', label: 'Order ID', type: 'text' },
    { value: 'create_ts', label: 'Booking Date', type: 'date' },
    { value: 'total_nights', label: 'LOS', type: 'number' },
]

export const statusOptions: ISelectOption[] = [
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Inquiry', value: 'inquiry' },
    { label: 'Request', value: 'request' },
    { label: 'New', value: 'new' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Black', value: 'black' },
]

export const bedroomsOptions: ISelectOption[] = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
]

export const bathroomsOptions: ISelectOption[] = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
]

export const quickSearchFields = [
    { name: 'user_name', label: 'Guest Name', type: 'text' as const },
    { name: 'area', label: 'Area', type: 'text' as const },
    { name: 'property_details_name', label: 'Property Name', type: 'text' as const },
    { name: 'booking_source', label: 'Booking Source', type: 'text' as const },
    { name: 'beds_id', label: 'Beds ID', type: 'number' as const },
    { name: 'from_date', label: 'Check In', type: 'date' as const },
    { name: 'to_date', label: 'Check Out', type: 'date' as const },
    {
        name: 'status',
        label: 'Status',
        type: 'select' as const,
        options: statusOptions,
    },
]

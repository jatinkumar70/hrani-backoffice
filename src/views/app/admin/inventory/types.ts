export interface Property {
    property_uuid: string
    property_name: string
}

export interface InventoryItem {
    inventory_uuid: string | null
    property_details_uuid: string
    property_details_name: string
    room_types_uuid: string
    room_types_name: string
    available_room: number
    non_refundable_price: number
    refundable_price: number
    calendar_uuid: string
    calendar_date: string
}

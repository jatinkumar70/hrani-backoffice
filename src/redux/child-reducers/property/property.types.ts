import { ICheckboxSelection } from '@/components/common/multiple-checkbox-section'
import type { ILoadState } from '@/redux/store.enums'

type Status = 'ACTIVE' | 'INACTIVE'

export interface IImageAlbum {
    album_name: string
    paths: string[]
    [key: string]: string | string[]
}

interface Location {
    location: string
    radius: string
}

export interface IRoomDetailImages {
    album_name: string
    paths: string[]
}


interface ICategory {
    category: string // Name of the category (e.g., "Attractions")
    locations: Location[] // List of locations with their respective radius
    showFields: boolean // Flag indicating whether fields are displayed
    isEditing: boolean // Flag to indicate if the category is in editing mode
}

export interface IProperty {
    property_name?: string
    map(
        arg0: (image: any) => void,
    ): import('react').ReactNode | Iterable<import('react').ReactNode>
    property_details_uuid: string
    property_details_name: string
    property_type: ''
    property_images: IImageAlbum[]
    about_property: string
    floor_plan: string[] | null
    property_details_profile_pic: string | null
    property_place_id: string
    nearby_places: string[]
    property_rating: string
    property_details_unique_id?: string
    yt_walkthrough_video: string[]
    property_address_line_1: string
    property_address_line_2?: string
    property_city: string
    area?: string
    nearbyLocations?: ICategory[]
    nearby_type: string
    property_state: string
    property_pincode: string
    property_country: string
    longitude: string
    latitude: string
    amenities: Array<{
        category: string
        amenities: Array<{
            master_amenities_uuid: string
            name: string
            icon: string
            code?: string
        }>
    }>
    checkin_time: string
    checkout_time: string
    food_and_dinning: ICheckboxSelection[]
    property_policies: {
        bookingType: 'autoConfirmed' | 'manual'
        priceRounding: 'none' | 'nearest'
        dailyPriceType: 'default' | 'custom'
        bookingNearType: 'autoConfirmed' | 'manual'
        bookingCutOffHour: number
        vatRatePercentage: number
        dailyPriceStrategy: 'allowLower' | 'fixed'
        bookingNearTypeDays: number | null
        allowGuestCancellation: {
            type: 'never' | 'flexible' | 'strict'
        }
    }
    BookingQuestion: {
        order: number | null;
        usage: "internal" | "optional" | "compulsoryBookingPage" | "notUsed";
        type?: "singleLineField";
    };
    rule_allowed: ICheckboxSelection[];
    rule_not_allowed: ICheckboxSelection[];
    user_name: string;
    security_deposit: string[];
    user_uuid: string;
    status: Status;
    price?: string;
    id: string;
    account: string;
    currency: string;
    room_name: string;
    slug: string;
    is_pet_friendly: boolean;
    max_occupancy: number;
    bedrooms: number;
    available_beds: number;
    queen_beds: number;
    king_beds: number;
    single_beds: number;
    double_beds: number;
    bathroom_full: number;
    bathroom_half: number;
    property_subtype: string;
    phone: string;
    mobile: string;
    fax?: string;
    email: string;
    web?: string;
    contactFirstName: string;
    contactLastName: string;
    checkInEnd: string;
    offerType: string;
    controlPriority: string;
    sellPriority: string;
    bookingPageMultiplier: number;
    permit: string;
    roomChargeDisplay: string;
    templates: string[];
    groupKeywords: string[];
    bookingRules: string[];
    bookingQuestions: string[];
    webhooks: string[];
    property_highlights: string[];
    roomTypes: string[];
    room_id?: string;
    create_ts?: string;
    insert_ts?: string;
    booking_request: Boolean;
}

export interface IPropertyState {
    property_list: {
        loading: ILoadState
        data: IProperty[]
        count: number
        error: string | null
    }
    single_property: {
        loading: ILoadState
        data: IProperty
        error: string | null
    }
}

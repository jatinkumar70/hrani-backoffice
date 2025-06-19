import { ICheckboxSelection } from "@/components/common/multiple-checkbox-section";



type PropertyType = "";
type Status = "ACTIVE" | "INACTIVE";

export interface IImageAlbum {
	album_name: string;
	paths: string[];
}

interface Location {
	location: string;
	radius: string;
}

interface ICategory {
	category: string;    // Name of the category (e.g., "Attractions")
	locations: Location[]; // List of locations with their respective radius
	showFields: boolean;  // Flag indicating whether fields are displayed
	isEditing: boolean;   // Flag to indicate if the category is in editing mode
}

export interface IProperty {
	property_name?: string;
	// property_type: string;
	// insert_ts: string;
	// property_city: string;
	// property_state: string;
	// slug: string;
	map(
		arg0: (image: any) => void
	): import("react").ReactNode | Iterable<import("react").ReactNode>;
	property_details_uuid: string;
	property_details_name: string;
	property_type: PropertyType;
	property_images: IImageAlbum[];
	about_property: string;
	floor_plan: string[] | null;
	property_details_profile_pic: string | null;
	// nearbyLocations: string[];
	property_place_id: string;
	nearby_places: string[];
	property_rating: string;
	// property_details_unique_id: string;
	yt_walkthrough_video: string[];
	property_address_line_1: string;
	property_address_line_2?: string;
	property_city: string;
	area?: string;
	nearbyLocations: ICategory[];
	nearby_type: string;
	property_state: string;
	property_pincode: string;
	property_country: string;
	longitude: string;
	latitude: string;
	amenities: Array<{
		category: string;
		amenities: Array<{
			master_amenities_uuid: string;
			name: string;
			icon: string;
			code?: string;
		}>;
	}>;
	checkin_time: string;
	checkout_time: string;
	food_and_dinning: ICheckboxSelection[];

	property_policies: {
		bookingType: "autoConfirmed" | "manual";
		priceRounding: "none" | "nearest";
		dailyPriceType: "default" | "custom";
		bookingNearType: "autoConfirmed" | "manual";
		bookingCutOffHour: number;
		vatRatePercentage: number;
		dailyPriceStrategy: "allowLower" | "fixed";
		bookingNearTypeDays: number | null;
		allowGuestCancellation: {
			type: "never" | "flexible" | "strict";
		};
	};
	BookingQuestion: {
		order: number | null;
		usage: "internal" | "optional" | "compulsoryBookingPage" | "notUsed";
		type?: "singleLineField"; // Optional, only present for custom questions
	};
	rule_allowed: ICheckboxSelection[];
	rule_not_allowed: ICheckboxSelection[];
	user_name: string;
	user_uuid: string;
	status: Status;
	price?: string;

	// new
	id: string;
	account: string;
	currency: string;
	room_name: string;
	slug: string;
	is_pet_friendly: boolean;
	security_deposit: string[];
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
	// read only
	create_ts?: string;
	insert_ts?: string;
}

export const defaultProperty: IProperty = {
	property_name: "",
	property_details_uuid: "",
	property_details_name: "",
	floor_plan: null,
	property_type: "",
	property_images: [
		{
			album_name: "",
			paths: [],
		},
	],
	property_details_profile_pic: null,
	about_property: "",
	property_place_id: "",
	yt_walkthrough_video: [],
	security_deposit: [],
	nearby_places: [],
	nearby_type: "",
	property_rating: "",
	// property_details_unique_id: "",
	property_address_line_1: "",
	property_address_line_2: "",
	property_city: "",
	property_state: "",
	// nearbyLocations: [],
	area: "",
	property_pincode: "",
	property_country: "",
	longitude: "",
	latitude: "",
	amenities: [],
	checkin_time: "",
	checkout_time: "",
	food_and_dinning: [],

	property_policies: {
		bookingType: "autoConfirmed",
		priceRounding: "none",
		dailyPriceType: "default",
		bookingNearType: "autoConfirmed",
		bookingCutOffHour: 0,
		vatRatePercentage: 0,
		dailyPriceStrategy: "allowLower",
		bookingNearTypeDays: null,
		allowGuestCancellation: {
			type: "never",
		},
	},

	BookingQuestion: {
		order: null,
		usage: "notUsed",
		type: undefined,
	},

	rule_allowed: [],
	rule_not_allowed: [],
	user_name: "",
	user_uuid: "",
	status: "ACTIVE",

	// new
	id: "",
	account: "",
	currency: "USD",
	room_name: "",
	slug: "",
	is_pet_friendly: false,
	max_occupancy: 0,
	bedrooms: 0,
	available_beds: 0,
	queen_beds: 0,
	king_beds: 0,
	single_beds: 0,
	double_beds: 0,
	bathroom_full: 0,
	bathroom_half: 0,
	property_subtype: "",
	phone: "",
	mobile: "",
	fax: "",
	email: "",
	web: "",
	contactFirstName: "",
	contactLastName: "",
	checkInEnd: "",
	offerType: "",
	controlPriority: "",
	sellPriority: "",
	bookingPageMultiplier: 1.0,
	permit: "",
	roomChargeDisplay: "",
	templates: [],
	groupKeywords: [],
	bookingRules: [],
	bookingQuestions: [],
	webhooks: [],
	property_highlights: [],
	roomTypes: [],
	room_id: "",
	// new end
	map: function (
		arg0: (image: any) => void
	): import("react").ReactNode | Iterable<import("react").ReactNode> {
		throw new Error("Function not implemented.");
	},
	nearbyLocations: []
};

export interface ICreateProperty {
	property_details_uuid: string | null;
	user_uuid: string | null;
	property_details_name: string;
	status: "ACTIVE";

	// read only
	create_ts?: string;
	insert_ts?: string;
}

export const defaultCreateProperty: ICreateProperty = {
	property_details_uuid: null,
	user_uuid: null,
	property_details_name: "",
	status: "ACTIVE",
};
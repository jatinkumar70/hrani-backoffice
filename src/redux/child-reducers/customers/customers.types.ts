


import { ILoadState } from "@/redux/store.enums";
import { IEducationProfile, ITravelHistoryProfile, IWorkHistoryProfile } from "../leads";
import { CUSTOMER_FAMILY_RELATION } from "./customers.constants";


export type ICustomerFamilyRelationship = (typeof CUSTOMER_FAMILY_RELATION)[number]

export interface ICustomerFamilyInformation {
    member_first_name: string
    member_last_name: string
    is_accompany_with_you: "YES" | "NO" | null,
    relationship: ICustomerFamilyRelationship | null
    member_dob: string
    place_of_birth: string
    marital_status: string
    present_address: string
}
export interface ICustomerPersonalHistory {
    from_date: string //month/year
    to_date: string //month/year
    activity: string
    city_country: string
    status_in_country: string,
    company_or_employer_name: string
}
export interface ICustomerRelativeDetail {
    relative_name: string
    relationship: ICustomerFamilyRelationship | null
    present_address: string
}
export interface ICustomerRelativeDetail {
    relative_name: string
    relationship: ICustomerFamilyRelationship | null
    present_address: string
}
export interface ICustomerMembershipOrAssociation {
    from_date: string //month/year
    to_date: string //month/year
    branch_or_officer_name: string
    rank: string,
    date_and_place: string
}


export interface ICustomer {
    customer_fact_uuid: string | null,
    branch_uuid: string,
    branch_name: string,
    // 1. General Information
    customer_first_name: string,
    customer_last_name: string,
    customer_sex: string
    customer_phone_number: string
    customer_email: string
    customer_dob: string
    customer_place_of_birth: string
    customer_country_of_birth: string

    customer_address_line1: string
    customer_address_line2: string
    customer_address_landmark: string
    customer_address_city: string
    customer_address_state_or_province: string
    customer_address_country: string
    customer_address_postal_code: string

    citizenship: string
    current_country_of_residence: string
    status_in_country: string,
    residency_expiry_date: string

    previous_country_of_residence: string
    height: string
    color_of_eyes: string

    // 2. Passport Details
    passport_details: {
        passport_number: string
        country_of_issue: string
        issue_date: string
        expiry_date: string
        valid_in_canada_from: string
        valid_in_canada_to: string
    }

    // 3. National ID
    national_identity_details: {
        national_identity_document: string
        document_number: string
        country_of_issue: string
        issue_date: string
        expiry_date: string
    }

    // 4. Marriage Information
    marriage_information: {
        current_status: "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED",
        date_of_marriage: string // if MARRIED

        // Previously MARRIED
        previously_married: "YES" | "NO"
        // if  YES
        date_of_previous_marriage: string,
        any_children_from_previous_marriage: "YES" | "NO"

        // if DIVORCED
        date_of_divoced: string
        date_of_separation: string,

    }

    // 5. Education Information
    educational_details: IEducationProfile[]

    // 6. Work Information
    work_history_details: IWorkHistoryProfile[]

    // 7. Travel History in Canada
    travel_history_in_canada: ITravelHistoryProfile[]

    // 8. Language Proficiency
    native_language: string,
    ilets_overall_score: string,
    ilets_reading: string
    ilets_listening: string
    ilets_speaking: string
    ilets_writing: string

    // 9. Additional Family Information
    additional_family_information: ICustomerFamilyInformation[]

    // 10. Customer Father Personal Details
    customer_father_details: {
        first_name: string
        last_name: string
        dob: string
        place_of_birth: string
        country_of_birth: string
        date_of_death: string // if deceased
    }

    // 12. Customer Mother Personal Details
    customer_mother_details: {
        first_name: string
        last_name: string
        dob: string
        place_of_birth: string
        country_of_birth: string
        date_of_death: string // if deceased
    }

    // 13. Customer Personal History (Details of past 10 years. NO GAPS PLEASE: If you were travelling even for 1 day to another country include that too. If you were studying, then write studying. If you were unemployed then write unemployed.)
    customer_personal_history: ICustomerPersonalHistory[]

    // 14. Customer membership or association with organization
    // · Government positions
    // · Military Service
    membership_or_association: {
        country_name: string
        membership: ICustomerMembershipOrAssociation[]
    }

    // 15. Customer Educational Details (List all secondary, post-secondary, university.):
    additional_education_details: IEducationProfile[]

    // 16. Do you have any relative in Canada: If yes then provide relationship details and status of the relative in Canada and location?
    relative_in_canada: "YES" | "NO"
    relative_details_and_status: ICustomerRelativeDetail[]



    status: "ACTIVE" | "INACTIVE"

    create_ts?: string
    insert_ts?: string
}

export interface ICustomerService {
    customer_service_uuid: string | null,
    customer_uuid: string,
    services_uuid: string,
    country: string,
    services_type: string
    services_sub_type: string
    questionnaire_name: string,
    questionnaire_uuid: string,
    status: "ACTIVE" | "INACTIVE"

    create_ts?: string
    insert_ts?: string
}

export interface ICustomerInvoiceItems {
    transaction_type: "SERVICE" | "PAYMENT" | "CORRECTION",
    correction_sign: "+" | "-",
    description: string,
    service_type: string,
    service_sub_type: string,
    tax: string,
    price: string,
}
export interface ICustomerInvoice {
    customer_invoice_uuid: string | null,
    customer_uuid: string,
    invoice_no: string,
    creation_date: string
    due_date: string

    company_address_line1: string
    company_address_line2: string
    company_city: string
    company_state: string
    company_country: string
    company_postal_code: string

    customer_address_line1: string
    customer_address_line2: string
    customer_city: string
    customer_state: string
    customer_country: string
    customer_postal_code: string

    invoice_items: ICustomerInvoiceItems[]

    payment_paid: string,
    adjustment: string
    taxes: string
    sub_total: string,
    total: string,

    status: "ACTIVE" | "INACTIVE"

    create_ts?: string
    insert_ts?: string
}


export interface ICustomerState {
    customers_list: {
        loading: ILoadState
        data: ICustomer[]
        count: number;
        error: string | null;
    },
    single_customer: {
        loading: ILoadState
        data: ICustomer
        error: string | null;
    },
    customer_services_list: {
        loading: ILoadState
        data: ICustomerService[]
        count: number;
        error: string | null;
    },
    customer_single_service: {
        loading: ILoadState
        data: ICustomerService
        error: string | null;
    },

    customer_invoice_list: {
        loading: ILoadState
        data: ICustomerInvoice[]
        count: number;
        error: string | null;
    },
    customer_single_invoice: {
        loading: ILoadState
        data: ICustomerInvoice
        error: string | null;
    },
}
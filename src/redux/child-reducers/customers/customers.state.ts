import { ILoadState } from "@/redux/store.enums";
import { ICustomer, ICustomerFamilyInformation, ICustomerInvoice, ICustomerInvoiceItems, ICustomerMembershipOrAssociation, ICustomerPersonalHistory, ICustomerRelativeDetail, ICustomerService, ICustomerState } from "./customers.types";


export const defaultCustomerFamilyInformation: ICustomerFamilyInformation = {
    member_first_name: "",
    member_last_name: "",
    relationship: null,
    member_dob: "",
    place_of_birth: "",
    marital_status: "",
    present_address: "",
    is_accompany_with_you: "YES"
}

export const defaultCustomerPersonalHistory: ICustomerPersonalHistory = {
    from_date: "", //month/year
    to_date: "", //month/year
    activity: "",
    city_country: "",
    status_in_country: "",
    company_or_employer_name: "",
}
export const defaultCustomerRelativeDetail: ICustomerRelativeDetail = {
    relative_name: "",
    relationship: null,
    present_address: "",
}

export const defaultCustomerMembershipOrAssociation: ICustomerMembershipOrAssociation = {
    from_date: "", //month/year
    to_date: "", //month/year
    branch_or_officer_name: "",
    rank: "",
    date_and_place: "",
}


export const defaultCustomer: ICustomer = {
    customer_fact_uuid: null,
    branch_uuid: "",
    branch_name: "",
    // 1. General Information
    customer_first_name: "",
    customer_last_name: "",
    customer_sex: "",
    customer_phone_number: "",
    customer_email: "",
    customer_dob: "",
    customer_place_of_birth: "",
    customer_country_of_birth: "",

    customer_address_line1: "",
    customer_address_line2: "",
    customer_address_landmark: "",
    customer_address_city: "",
    customer_address_state_or_province: "",
    customer_address_country: "",
    customer_address_postal_code: "",

    citizenship: "",
    status_in_country: "",
    current_country_of_residence: "",
    residency_expiry_date: "",
    previous_country_of_residence: "",
    height: "",
    color_of_eyes: "",

    // 2. Passport Details
    passport_details: {
        passport_number: "",
        country_of_issue: "",
        issue_date: "",
        expiry_date: "",
        valid_in_canada_from: "",
        valid_in_canada_to: "",
    },

    // 3. National ID
    national_identity_details: {
        national_identity_document: "",
        document_number: "",
        country_of_issue: "",
        issue_date: "",
        expiry_date: "",
    },

    // 4. Marrige Information
    marriage_information: {
        current_status: "SINGLE",
        date_of_marriage: "", // if MARRIED

        // Previously MARRIED
        previously_married: "NO",
        // if  YES
        date_of_previous_marriage: "",
        any_children_from_previous_marriage: "NO",

        // if DIVORCED
        date_of_divoced: "",
        date_of_separation: "",

    },

    // 5. Education Information
    educational_details: [],

    // 6. Work Information
    work_history_details: [],

    // 7. Travel History in Canada
    travel_history_in_canada: [],

    // 8. Language Proficiency
    native_language: "",
    ilets_overall_score: "",
    ilets_reading: "",
    ilets_listening: "",
    ilets_speaking: "",
    ilets_writing: "",

    // 9. Additional Family Information
    additional_family_information: [],

    // 10. Customer Father Personal Details
    customer_father_details: {
        first_name: "",
        last_name: "",
        dob: "",
        place_of_birth: "",
        country_of_birth: "",
        date_of_death: "", // if deceased
    },

    // 12. Customer Mother Personal Details
    customer_mother_details: {
        first_name: "",
        last_name: "",
        dob: "",
        place_of_birth: "",
        country_of_birth: "",
        date_of_death: "", // if deceased
    },

    // 13. Customer Personal History (Details of past 10 years. NO GAPS PLEASE: If you were travelling even for 1 day to another country include that too. If you were studying, then write studying. If you were unemployed then write unemployed.)
    customer_personal_history: [],

    // 14. Customer membership or association with organization
    // · Government positions
    // · Military Service
    membership_or_association: {
        country_name: "",
        membership: []
    },

    // 15. Customer Educational Details (List all secondary, post-secondary, university.):
    additional_education_details: [],

    // 16. Do you have any relative in Canada: If yes then provide relationship details and status of the relative in Canada and location?
    relative_in_canada: "NO",
    relative_details_and_status: [],



    status: "ACTIVE"
}
export const defaultCustomerService: ICustomerService = {
    customer_service_uuid: null,
    customer_uuid: "",
    services_uuid: "",
    country: "",
    services_type: "",
    services_sub_type: "",
    questionnaire_uuid: "",
    questionnaire_name: "",
    status: "ACTIVE"
}

export const defaultCustomerInvoiceItem: ICustomerInvoiceItems = {
    transaction_type: "SERVICE",
    correction_sign: "+",
    description: "",
    service_type: "",
    service_sub_type: "",
    tax: "",
    price: "",
}

export const defaultCustomerInvoice: ICustomerInvoice = {
    customer_invoice_uuid: null,
    customer_uuid: "",
    invoice_no: "",
    creation_date: "",
    due_date: "",

    company_address_line1: "",
    company_address_line2: "",
    company_city: "",
    company_state: "",
    company_country: "",
    company_postal_code: "",

    customer_address_line1: "",
    customer_address_line2: "",
    customer_city: "",
    customer_state: "",
    customer_country: "",
    customer_postal_code: "",

    invoice_items: [defaultCustomerInvoiceItem],

    payment_paid: "",
    adjustment: "",
    taxes: "",
    sub_total: "",
    total: "",

    status: "ACTIVE"

}

export const defaultCustomerState: ICustomerState = {
    customers_list: {
        loading: ILoadState.idle,
        data: [],
        count: 0,
        error: null
    },
    single_customer: {
        loading: ILoadState.idle,
        data: defaultCustomer,
        error: null
    },
    customer_services_list: {
        loading: ILoadState.idle,
        data: [],
        count: 0,
        error: null
    },
    customer_single_service: {
        loading: ILoadState.idle,
        data: defaultCustomerService,
        error: null
    },
    customer_invoice_list: {
        loading: ILoadState.idle,
        data: [],
        count: 0,
        error: null
    },
    customer_single_invoice: {
        loading: ILoadState.idle,
        data: defaultCustomerInvoice,
        error: null
    },
}
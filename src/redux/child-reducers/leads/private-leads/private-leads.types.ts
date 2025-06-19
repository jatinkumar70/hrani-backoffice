import type { ILoadState } from "@/redux/store.enums";
import { ILanguageTest, RETAINER_AGREEMENT_TYPE } from "./private-leads.constants";
import { IDocumentStatus } from "../documents";

export type ILanguageTestType = "SPEAKING" | "LISTENING" | "READING" | "WRITING"


export interface IEducationProfile {
    from: string,
    to: string,
    qualification: string | null,
    marks_percentage: string | null,
    school_or_university: string | null,
    country: string | null
    is_eca_approved?: 0 | 1
}

export interface IWorkHistoryProfile {
    designation: string,
    employement_type: "FULL_TIME" | "PART_TIME" | "SELF_EMPLOYED" | "FREELANCE" | "INTERNSHIP" | "TRAINEE" | null // Full Time | Part Time | Self Employed | Freelance | Intership | Trainee
    currently_working: boolean
    from: string,
    to: string,
    company_name: string
    company_location: string
    location_type: "ON_SITE" | "HYBRID" | "REMOTE" | null
    work_description: string | null
    country: string
}

export interface ITravelHistoryProfile {
    from_date: string,
    to_date: string,
    duration: string,
    destination: string,
    purpose_of_travel: string,
    description: string,
}

export type IServiceType = "PR" | "WORK_PERMIT" | "STUDY" | "VISITOR"
export type IServiceSubType = {
    PR: "EXPRESS_ENTRY" | "PNP_FEDRAL" | "ONTARIIO_PNP",
    WORK_PERMIT: "LMIA" | "PGWP" | "DEPENDAND_WORK_PERMIT" | "PNP_WORK_PERMIT" | "ICT",
    STUDY: "SCHOOLS" | "UNIVERSITIES",
    VISITOR: "VISITOR" | "BUSINESS" | "SUPER_VISA"
}

export interface ICRSPointCalulations {
    core_human_capital_factor: {
        age: number,
        level_of_education: number,
        official_languages_subtotal: number    // first_official_language + second_official_language
        official_languages: {
            first_official_language: number,
            second_official_language: number,
        },
        canadian_work_experience: number,
        subtotal: number
    },
    spouse_factor: {
        level_of_education: number,
        first_official_language: number,
        second_official_language: number,
        canadian_work_experience: number,
        subtotal: number
    },
    skill_transferbility_factor: {
        education: {
            official_language_proficiencey_and_education: number,
            canadian_work_experience_and_education: number,
            subtotal: number,
        },
        foreign_work_experience: {
            official_language_proficiencey_and_foreign_work_experience: number,
            canadian_and_foreign_work_experience: number,
            subtotal: number,
        },
        certificate_of_qualification: number
        subtotal: number, // education + foreign_work_experience
    },
    additional_point: {
        provinicial_nomination: number,
        job_offer: number,
        study_in_canada: number,
        sibling_in_canada: number,
        french_language_skills: number,
        subtotal: number
    },
    comprehensive_ranking_system_formula_grand_total: number,
    total: number
}

export interface IPrivateLead {
    sponsor_type: string | null,
    leads_uuid: string | string | null,
    leads_code: string,
    service_type: IServiceType,
    service_sub_type: IServiceSubType[IServiceType],

    applicant_first_name: string,
    applicant_last_name: string,
    applicant_date_of_birth: string,
    applicant_sex: string,
    contact_number: string,
    email: string,
    created_by_name: string,
    user_email: string,
    marital_status: string | null,
    number_of_children: string,
    education: IEducationProfile[],
    travel_history: ITravelHistoryProfile[],
    work_history: IWorkHistoryProfile[],
    nationality: string
    country_of_residence: string
    status_in_country: string
    sponsor_income: string | null
    currency_field: string
    movable: number | null,
    immovable: number | null,
    net_worth: number | null

    // Applicant First official Language Details
    english_language_test_type: ILanguageTest | null,
    english_test_result_less_than_two_years: "YES" | "NO",
    english_ability_speaking: number | null,
    english_ability_reading: number | null,
    english_ability_writing: number | null,
    english_ability_listening: number | null,

    // Applicant Second official Language Details
    french_language_test_type: ILanguageTest | null,
    french_test_result_less_than_two_years: "YES" | "NO"
    french_ability_speaking: number | null,
    french_ability_reading: number | null,
    french_ability_writing: number | null,
    french_ability_listening: number | null,

    //----------- Applicant Spuse Details -----------
    spouse_name: string | null,
    spouse_date_of_birth: string | null,
    spouse_sex: string | null,
    spouse_education: IEducationProfile[],
    spouse_work_history: IWorkHistoryProfile[],

    // Spouse Second official Language Details
    spouse_english_language_test_type: ILanguageTest | null,    // add from be
    spouse_english_test_result_less_than_two_years: "YES" | "NO",    // add from be
    spouse_english_ability_speaking: number | null,
    spouse_english_ability_reading: number | null,
    spouse_english_ability_writing: number | null,
    spouse_english_ability_listening: number | null,


    passport: string | null,            // File
    wes_document: string | null,        // File
    iltes_document: string | null,      // File
    resume: string | null,              // File


    self_employment: string | null,
    leads_source: string | null,
    specify: string | null,
    notes: string | null,
    comment: string | null,
    time_to_contact: string | null,
    assigned_to_id: string | null,
    status: "ACTIVE" | "DEAD" | "OPPORTUNITY"

    certificate_of_qualification: "YES" | "NO" | null
    is_valid_job_offer: "YES" | "NO" | null,
    noc_teer_job_offer_type: string | null;
    relatives_in_canada: "YES" | "NO" | null,
    province_or_territory_nomination: "YES" | "NO" | null,
    // additional_points: {
    //     brother_or_sister_living_in_canada_who_is_a_citizen_or_permanent_resident_of_canada: boolean,
    //     nclc_7_or_higher_all_french_and_clb_4_or_lower_in_english_or_did_not_take_an_English_test: boolean,
    //     nclc_7_or_higher_all_french_and_clb_5_or_higher_all_english_skills: boolean,
    //     post_secondary_education_canada_credential_1_or_2_years: boolean,
    //     post_secondary_education_canada_credential_3_years_or_longer: boolean,
    //     arranged_employment_noc_teer_0_major_group_00: boolean,
    //     arranged_employment_noc_teer_1_2_or_3_or_any_teer_0_other_than_major_group_00: boolean,
    //     provincial_or_territorial_nomination: boolean,
    // }


    //----------- Student Form Structure -----------
    current_residential_address: string | null,
    primary_language: string | null,
    Date_of_IELTS_exam: string | null,
    overall_IELTS_score: string | null,
    which_intake_you_want_to_apply_for: string | null,
    intake_year: string | null,
    program_type_apply_for: string | null,

    visa_refusal: string | null,
    study_permit_visa_type: string | null,


    //----------- Point Calculation Output Structure -----------
    applicant_crs_points?: ICRSPointCalulations

    sign_status?: IDocumentStatus | null

    asignee_uuid: string | null
    asignee_name: string | null
    asignee_email: string | null
}



export interface ILeadActivity {
    history_uuid: string;
    module_id: string | null;
    module_uuid: string | null; //enquiry_uuid
    module_name: string; // eg: ENQUIRY | QUOTE | COSTING_SHEET etc
    module_column_name: string | null;
    name: string | null;
    message: string | null;

    created_by_uuid?: string;
    create_ts?: string;
}

export type IRetainerAgreementType = (typeof RETAINER_AGREEMENT_TYPE)[number]

export interface IRetainerAgreement {
    retainer_uuid: string
    module_uuid: string;
    module_name: string; // eg: ENQUIRY | QUOTE | COSTING_SHEET etc

    client_name: string;
    client_email: string;
    client_contact_number: string;
    service_type: IServiceType;
    service_sub_type: string;
    amount_upon_on_this_agreement: string;
    amount_on_this_service: string;
    amount_due_upon_on_this_agreement: string;
    hst: string,
    hst_rate: number,
    total_due: string
    aggrement_date: string
    retainer_type: IRetainerAgreementType | null
    file_path: string | null
    status: string,
    document_status?: string
    signed_status?: string
    send_status?: string
    job_title: string | null
    job_description: string | null
    create_ts?: string;
    insert_ts?: string;

}

export interface IPrivateLeadState {
    private_leads_list: {
        loading: ILoadState
        data: IPrivateLead[];
        count: number;
        error: string | null;
    },
    single_private_lead: {
        loading: ILoadState
        data: IPrivateLead;
        error: string | null;
    },
    single_lead_activity: {
        loading: ILoadState
        data: ILeadActivity[];
        count: number;
        error: string | null;
    }
    single_lead_sugessions: {
        loading: ILoadState
        data: {
            assessment: string[]
            improvement: string[]
        };
        error: string | null;
    },
    single_lead_report: {
        loading: ILoadState
        data: string | null;
        error: string | null;
    },
    single_lead_retainer_agreement_list: {
        loading: ILoadState
        data: IRetainerAgreement[];
        count: number;
        error: string | null;
    }
    single_retainer_agreement: {
        loading: ILoadState
        data: IRetainerAgreement;
        error: string | null;
    }
}



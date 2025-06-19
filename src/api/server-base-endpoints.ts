export const server_base_endpoints = {
    general: {
        upload_files: '/general/upload-files',

        file_explorer: '/general/file-explorer',
        file_move: '/general/file-move',
        file_rename_folder: '/general/file-rename-folder',
        file_rename: '/general/file-rename',
        get_record_counts: '/general/get-record-counts',
        download_files: '/general/download-files',
    },
    auth: {
        sign_in: '/authentication/login',
        sign_up: '/authentication/sign-up',
        validate_otp: '/authentication/validate-otp-get-token',
        forget_password: '/authentication/forget-password',
    },
    users: {
        get_users: '/user/get-user',
        upsert_profile: '/user/update-profile',
        create_new_user: '/user/upsert-user',
    },
    approvals: {
        get_approvals_count: '/approval/get-approval-count',
        upsert_approvals_count: '/approval/insert-approval-count',
    },
    leads: {
        leads: {
            upsert_public_leads: '/lead/upsert-lead',
            upsert_private_leads: '/lead/auth-upsert-lead',
            get_private_leads: '/lead/get-leads',
            get_private_lead_suggestions: '/lead/lead-suggestion',
            get_private_lead_reports: '/lead/lead-reports',
            sign_document: '/lead/sign-document',
            signature_history: '/lead/signature-history',
            generate_signed_document: '/lead/generate-signed-document',
            get_retainer_agreement: '/lead/get-retainer',
            upsert_retainer_agreement: '/lead/retainer',
        },
        crs_draws: {
            upsert_crs_draws: '/lead/edit-crs_draws',
            get_crs_draws: '/lead/get-crs_draws',
        },
        noc_codes: {
            upsert_noc_codes: '/lead/edit-noc_codes',
            get_noc_codes: '/lead/get-noc_codes',
        },
        study_program: {
            upsert_study_programs: '/lead/edit-study',
            get_study_programs: '/lead/get-study',
        },
    },
    history: {
        get_history: '/history/get-history',
    },
    comments: {
        upsert_commnet: '/comment/upsert-comment',
        get_commnet: '/comment/get-comment',
    },
    configurations: {
        company: {
            upsert_company_private_info:
                '/companyInformation/upsert-company-information',
            get_company_private_info:
                '/companyInformation/get-company-information',
        },
    },
    security: {
        get_roles: '/security/get-roles',
        upsert_roles: '/security/upsert-roles',
        get_role_groups: '/security/get-role-groups',
        upsert_role_group: '/security/upsert-role-group',
        upsert_rmcap: '/security/upsert-role-module-content-access-permission',
    },
    questionnaire: {
        upsert_questionnaire: '/questionnaire/upsert-questionnaire',
        duplicate_questionnaire: '/questionnaire/duplicate-questionnaire',

        get_questionnaire: '/questionnaire/get-questionnaire',
        upsert_question: '/questionnaire/upsert-question',
        get_question: '/questionnaire/get-question',
        upsert_answer: '/questionnaire/upsert-answer',
        get_answer: '/questionnaire/get-answer',
        upsert_questions_options: '/questionnaire/upsert-questions-options',
        get_questions_options: '/questionnaire/get-questions-options',
        get_question_with_answer: '/questionnaire/get-question-answer',
    },
    services: {
        get_service: '/services/get-services',
        upsert_service: '/services/create-services',
    },
    customers: {
        upsert_customer: '/customer/upsert-customer',
        get_customers: '/customer/get-customer',
        upsert_customer_service: '/customer/upsert-customer-service',
        get_customer_services: '/customer/get-customer-service',
        upsert_customer_automation: '/customer/upsert-customer-automation',
        get_customer_automation: '/customer/get-customer-automation',
        upsert_customer_invoice: '/customer/upsert-customer-invoice',
        get_customer_invoice: '/customer/get-customer-invoice',
    },
    data_management: {
        upsert_branch: '/dataManagement/upsert-branch',
        get_branch: '/dataManagement/get-branch',
        get_enquiry: '/dataManagement/get-enquiry-request',
        get_referral: '/dataManagement/get-bni-click',
        upsert_referral: '/dataManagement/upsert-bni-click',
    },
    vouchers: {
        get_vouchers: '/package/get-voucher',
        create_voucher: '/package/upsert-voucher',
        update_voucher: '/package/upsert-voucher',
        delete_voucher: '/package/delete-voucher',
    },
    property: {
        get_property: '/property/get-property',
        create_property: '/property/create-property',
        upsert_property: '/property/upsert-property',
        get_property_areas: '/property/get-property-area',
    },
    inventory: {
        get_inventory: '/inventory/get-inventory',
        upsert_inventory: '/inventory/upsert-inventory',
        upsert_bulk_inventory: '/inventory/upsert-bulk-inventory',
    },
    pms: {
        insert_property_with_pms: '/pms/insert-property-with-pms',
    },
    formulas: {
        // Booking Source
        upsert_booking_source: "/formulas/upsert-booking-source",
        get_booking_source: "/formulas/get-booking-source",
        get_booking_channel: "/formulas/get-booking-channel",
        // Formulas
        upsert_formula_calculator: "/formulas/upsert-formula-calculator",
        get_formula_calculator: "/formulas/get-formula-calculator-log",
        // Functions
        get_formula_internal_functions: "/formulas/get-libraries-and-propertie", // Get Internal Function
        get_formula_external_functions: "/formulas/get-internal-functions", // Get External Function
        get_formula_external_variable: "/formulas/get-formula-external-variable", // Get External Variables
        // Formula Validation
        validate_formula: "/formulas/check-formula",  // Validate Formula
    }
}

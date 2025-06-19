import { ILoadState } from "@/redux/store.enums";


export interface ICompanyInformation {
    company_uuid: string | null,
    company_name: string | null;
    company_title: string | null,
    company_description: null,
    address: string | null;
    unit_or_suite: string | null;
    city: string | null;
    province_or_state: string | null;
    postal_code: string | null;
    country: string | null;
    phone: string | null;
    telephone: string | null;
    fax: string | null;
    default_language: string | null;
    // email: string | null;
    accounts_email: string | null;
    cl_email: string | null;
    pl_email: string | null;
    default_tax_region: string | null;
    pst_gst_vat_number: string | null;
    bahamas_premium_tax: string | null;
    logo: string | null;
    fav_icon: string | null;
    status: string;
    pst_or_gst_or_vat_number: string | null,
    adsense_header_code: string | null,
    about: string | null,

    create_ts?: string;
    insert_ts?: string;
}

export interface ICompanyInformationState {
    data: ICompanyInformation;
    loading: ILoadState;
    error: string | null;
}
import { ILoadState } from "@/redux/store.enums"
import { ICompanyInformation, ICompanyInformationState } from "./comapany-info.types"


export const defaultCompanyInformation: ICompanyInformation = {
    company_uuid: null,
    company_name: null,
    address: null,
    unit_or_suite: null,
    city: null,
    province_or_state: null,
    postal_code: null,
    country: null,
    phone: null,
    telephone: null,
    fax: null,
    default_language: null,
    // email: null,
    accounts_email: null,
    cl_email: null,
    pl_email: null,
    default_tax_region: null,
    pst_gst_vat_number: null,
    bahamas_premium_tax: null,
    logo: null,
    fav_icon: null,
    status: "",
    about: "",
    adsense_header_code: "",
    company_description: null,
    company_title: "",
    pst_or_gst_or_vat_number: "",
}

export const defaultCompanyInformationState: ICompanyInformationState = {
    data: defaultCompanyInformation,
    loading: ILoadState.idle,
    error: null,
}

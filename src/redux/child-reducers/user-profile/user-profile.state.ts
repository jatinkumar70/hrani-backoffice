import { ILoadState } from "@/redux/store.enums";
import { ICreateNewUser, IUserBranch, IUserProfile, IUserProfileState } from "./user-profile.types";

export const defaultCreateNewUser: ICreateNewUser = {
    email: "",
    user_password: "",
    first_name: "",
    role_uuid: "",
    role_value: "",
    branch_uuid: null,
    branch_name: null,
    user_uuid: null,
    last_name: null,
    status: "ACTIVE"
}

export const defaultUserBranch: IUserBranch = {
    branch_uuid: null,
    branch_name: "",
    status: "ACTIVE",
};


export const defaultUserProfile: IUserProfile = {
    first_name: "",
    personal_email: "",
    user_uuid: "",
    branch_uuid: "",
    branch_name: "",
    last_name: null,
    job_title: null,
    manager_uuid: null,
    hierarchy_uuids: null,
    user_type: null,
    assigned_phone_number: null,
    shared_email: null,
    mobile: null,
    home_phone: null,
    linkedin_profile: null,
    hire_date: null,
    last_day_at_work: null,
    department: null,
    fax: null,
    date_of_birth: null,
    mother_maiden_name: null,
    photo: null,
    signature: null,
    street_address: null,
    unit_or_suite: null,
    city: null,
    province_or_state: null,
    postal_code: null,
    country: null,
    languages_known: null,
    documents: null,
    status: "ACTIVE",
    role_uuid: "",
    role_value: ""


}


export const defaultUserProfileState: IUserProfileState = {
    user_profile_list: {
        loading: ILoadState.idle,
        data: [],
        count: 0,
        error: null,
    },
    single_user_profile: {
        loading: ILoadState.idle,
        data: defaultUserProfile,
        error: null,
    },
}
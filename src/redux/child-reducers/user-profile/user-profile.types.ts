import { ILoadState } from '@/redux/store.enums'
import { ISecurityGroup } from '../app-security'

export interface ICreateNewUser {
    email: string
    user_password: string
    first_name: string
    role_uuid: string | null
    role_value: string | null
    branch_uuid: string | null
    branch_name: string | null
    user_uuid: string | null
    last_name: string | null
    status: 'UNAUTHORIZE' | 'ACTIVE' | 'INACTIVE' | 'BLOCKED'
}

export interface IUserBranch {
    branch_name: string
    branch_uuid: string | null
    status: string
    create_ts?: string
    insert_ts?: string
}

export interface IUserProfile {
    first_name: string
    email?: string
    personal_email: string
    user_uuid: string
    branch_uuid: string
    branch_name: string
    last_name: string | null
    job_title: string | null
    manager_uuid: string | null
    hierarchy_uuids: string | null
    user_type: string | null
    assigned_phone_number: string | null
    shared_email: string | null
    mobile: string | null
    home_phone: string | null
    linkedin_profile: string | null
    hire_date: string | null
    last_day_at_work: string | null
    department: string | null
    fax: string | null
    date_of_birth: string | null
    mother_maiden_name: string | null
    photo: string | null
    signature: string | null
    street_address: string | null
    unit_or_suite: string | null
    city: string | null
    province_or_state: string | null
    postal_code: string | null
    country: string | null
    languages_known: string | null
    documents: string | null
    status: 'ACTIVE' | "INACTIVE"

    module_security?: ISecurityGroup[]
    role_uuid: string
    role_value: string
    full_name?: string
    user_dim_id?: number
    user_fact_id?: number
    user_profile_id?: number
    create_ts?: string
    insert_ts?: string
    name?: string
    username?: string

    // Add these for form handling (not for API)
    password?: string // Temporary field for form
    confirmPassword?: string // Temporary field for form
    newPassword?: string // Temporary field for form
}

export interface IUserProfileState {
    user_profile_list: {
        loading: ILoadState
        data: IUserProfile[]
        count: number
        error: string | null
    }
    single_user_profile: {
        loading: ILoadState
        data: IUserProfile
        error: string | null
    }
}

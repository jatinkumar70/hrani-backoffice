import type {
    ICustomerAutomationState,
    ICustomerState,
    IDocumentState,
    IGeneralState,
    ILoadingAndSnackbarState,
    IPrivateLeadState,
    IQuestionnaireState,
    IReferralState,
    ISecurityState,
    IServiceState,
} from './child-reducers'
import { ICommentState } from './child-reducers/comments'
import { ICompanyInformationState } from './child-reducers/configurations'
import { IUserProfileState } from './child-reducers/user-profile'
import { IBranchState } from './child-reducers/data-management'
import { IPropertyState } from './child-reducers/property/property.types'
import { IExpressionTransformationState } from './child-reducers/expressionTransformation/expressionTransformation.types'
import { IFormulaState } from './child-reducers/formula/formula.types'

export interface ISearchQueryParams {
    status?: string
    page: number
    rowsPerPage: number
    columns?: string[]
    value?: string
    fromDate?: string
    toDate?: string
}
export interface ISearchQueryParamsV2 {
    page: number
    rowsPerPage: number
    status?: string
    columns?: string[]
    date?: {
        fromDate?: string
        toDate?: string
    }
    searchValue?: string
    moduleName?: string
    subModuleName?: string
    tableName?:
        | 'latest_leads'
        | 'documents'
        | 'crs_draws'
        | 'answers'
        | 'latest_questions_options'
        | 'latest_noc_codes'
        | 'latest_study_program'
        | 'latest_services'
        | 'latest_user'
        | 'latest_role'
        | 'latest_role_group'
        | 'latest_approval'
        | 'latest_approval_count'
        | 'latest_crs_draws'
        | 'latest_questionnaire'
    advanceFilter?: string
}

export interface IStoreState {
    general: IGeneralState
    leads: {
        leads: IPrivateLeadState
        customers: ICustomerState
        documents: IDocumentState
    }
    comments: ICommentState
    loadingAndSnackbar: ILoadingAndSnackbarState
    configurations: {
        comapny: ICompanyInformationState
    }
    property: IPropertyState
    management: {
        settings: {
            customerAutomation: ICustomerAutomationState
        }
        services: IServiceState
        questionnaire: IQuestionnaireState
        userProfiles: IUserProfileState
        security: ISecurityState
    }
    dataManagement: {
        branch: IBranchState
        referral: IReferralState
    }
    formula: IFormulaState
    expressionTransformation: IExpressionTransformationState
}

export interface IPostWrapperWithCallback<P, R> {
    payload: P
    onSuccess: (isSuccess: boolean, data?: R) => void
}

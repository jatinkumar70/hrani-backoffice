import {
    defaultBranchState,
    defaultCustomerAutomationState,
    defaultCustomerState,
    defaultDocumentState,
    defaultGeneralState,
    defaultLoadingAndSnackbarState,
    defaultPrivateLeadState,
    defaultQuestionnaireState,
    defaultReferralState,
    defaultSecurityState,
    defaultServiceState,
} from './child-reducers'
import { defaultCommentState } from './child-reducers/comments'
import { defaultCompanyInformationState } from './child-reducers/configurations'
import { initialExpressionTransformation } from './child-reducers/expressionTransformation/expressionTransformation.types'
import { initialFormulaState } from './child-reducers/formula/formula.types'
import { defaultPropertyState } from './child-reducers/property/property.state'

import { defaultUserProfileState } from './child-reducers/user-profile'

import type { IStoreState } from './store.types'

export const defaultStoreState: IStoreState = {
    general: defaultGeneralState,
    leads: {
        leads: defaultPrivateLeadState,
        customers: defaultCustomerState,
        documents: defaultDocumentState,
    },
    property: defaultPropertyState,
    comments: defaultCommentState,
    loadingAndSnackbar: defaultLoadingAndSnackbarState,
    configurations: {
        comapny: defaultCompanyInformationState,
    },
    management: {
        settings: {
            customerAutomation: defaultCustomerAutomationState,
        },
        services: defaultServiceState,
        questionnaire: defaultQuestionnaireState,
        userProfiles: defaultUserProfileState,
        security: defaultSecurityState,
    },
    dataManagement: {
        branch: defaultBranchState,
        referral: defaultReferralState,
    },
    expressionTransformation: initialExpressionTransformation,
    formula: initialFormulaState,
}

import { combineReducers } from 'redux'

import {
    branchReducer,
    comapnyInformationReducer,
    commentsReducer,
    customerAutomationReducer,
    customersReducer,
    documentsReducer,
    generalReducer,
    leadsReducer,
    loadingAndSnackbarReducer,
    questionnaireReducer,
    referralReducer,
    securityReducer,
    servicesReducer,
    userProfileReducer,
    voucherReducer,
} from './child-reducers'

import { propertyReducer } from './child-reducers/property'
import { formulaReducer } from './child-reducers/formula/formulaReducer'
import { expressionTransformationReducer } from './child-reducers/expressionTransformation/expressionTransformationReducer'

export const root_reducer = combineReducers({
    general: generalReducer,
    leads: combineReducers({
        leads: leadsReducer,
        customers: customersReducer,
        documents: documentsReducer,
    }),
    comments: commentsReducer,
    loadingAndSnackbar: loadingAndSnackbarReducer,
    configurations: combineReducers({
        comapny: comapnyInformationReducer,
    }),
    property: propertyReducer,
    management: combineReducers({
        settings: combineReducers({
            customerAutomation: customerAutomationReducer,
        }),
        services: servicesReducer,
        questionnaire: questionnaireReducer,
        userProfiles: userProfileReducer,
        security: securityReducer,
        vouchers: voucherReducer,
    }),
    dataManagement: combineReducers({
        branch: branchReducer,
        referral: referralReducer,
    }),
    formula: formulaReducer,
    expressionTransformation: expressionTransformationReducer,
})

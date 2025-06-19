import { createSlice } from '@reduxjs/toolkit'

import { defaultSecurityState } from './app-security.state'
import {
    fetchMultipleSecurityRolesAsync,
    fetchSecurityApprovalListAsync,
    fetchSecurityGroupAsync,
} from './app-security.actions'
import { ILoadState } from '@/redux/store.enums'
import { fetchSecurityRoleGroupListAsync } from './role-group'

const securitySlice = createSlice({
    initialState: defaultSecurityState,
    name: 'security',
    reducers: {
        clearSecurityFullStateSync: (state) => {
            return defaultSecurityState
        },
        clearSingleSecuritytateSync: (state) => {
            state.groups.loading = defaultSecurityState.groups.loading
            state.groups.group = defaultSecurityState.groups.group
            state.groups.error = defaultSecurityState.groups.error
        },
        clearSecurityRoleGroupListAsync: (state) => {
            state.roleGroups = defaultSecurityState.roleGroups
        },
        clearSecurityApproval: (state) => {
            state.approval = defaultSecurityState.approval
        },
    },
    extraReducers: (builder) => {
        // ####################################################################################################
        // ################################ Security ##########################################################
        // ####################################################################################################
        // ############################# fetchMultipleSecurityRolesAsync ######################################
        builder.addCase(
            fetchMultipleSecurityRolesAsync.pending,
            (state, action) => {
                state.roles.loading = ILoadState.pendingz
            },
        )
        builder.addCase(
            fetchMultipleSecurityRolesAsync.fulfilled,
            (state, action) => {
                state.roles.loading = ILoadState.succeeded
                state.roles.list = action.payload.data
                state.roles.totalRecords = action.payload.count
                state.roles.error = null
            },
        )
        builder.addCase(
            fetchMultipleSecurityRolesAsync.rejected,
            (state, action) => {
                state.roles.error = action.error.message as string
            },
        )

        // #################################### fetchSecurityGroupAsync ##############################################

        builder.addCase(fetchSecurityGroupAsync.pending, (state) => {
            state.groups.loading = ILoadState.pending
            state.groups.error = null
        })
        builder.addCase(fetchSecurityGroupAsync.fulfilled, (state, action) => {
            const { data, role, roleGroup, status } = action.payload
            state.groups.loading = ILoadState.succeeded
            state.groups.group = data
            state.groups.roleName = role
            state.groups.role_group = roleGroup
            state.groups.status = status
            state.groups.error = null
        })
        builder.addCase(fetchSecurityGroupAsync.rejected, (state, action) => {
            state.groups.loading = ILoadState.failed
            state.groups.error = action.error.message as string
        })

        // ####################################################################################################
        // ################################ Security ##########################################################
        // ####################################################################################################

        // ############################# fetchSecurityRoleGroupListAsync ######################################
        builder.addCase(
            fetchSecurityRoleGroupListAsync.pending,
            (state, action) => {
                state.roleGroups.loading = ILoadState.pending
            },
        )
        builder.addCase(
            fetchSecurityRoleGroupListAsync.fulfilled,
            (state, action) => {
                state.roleGroups.loading = ILoadState.succeeded
                state.roleGroups.list = action.payload.data
                state.roleGroups.totalRecords = action.payload.count
                state.roleGroups.error = null
            },
        )
        builder.addCase(
            fetchSecurityRoleGroupListAsync.rejected,
            (state, action) => {
                state.roleGroups.error = action.error.message as string
            },
        )

        // ####################################################################################################
        // ################################ Security Approvals ################################################
        // ####################################################################################################

        // ############################# fetchSecurityRoleGroupListAsync ######################################
        builder.addCase(
            fetchSecurityApprovalListAsync.pending,
            (state, action) => {
                state.approval.loading = ILoadState.pending
            },
        )
        builder.addCase(
            fetchSecurityApprovalListAsync.fulfilled,
            (state, action) => {
                state.approval.loading = ILoadState.succeeded
                state.approval.list = action.payload.data
                state.approval.totalRecords = action.payload.count
                state.approval.error = null
            },
        )
        builder.addCase(
            fetchSecurityApprovalListAsync.rejected,
            (state, action) => {
                state.approval.error = action.error.message as string
            },
        )
    },
})

export const securityReducer = securitySlice.reducer
export const {
    clearSecurityFullStateSync,
    clearSingleSecuritytateSync,
    clearSecurityRoleGroupListAsync,
    clearSecurityApproval,
} = securitySlice.actions

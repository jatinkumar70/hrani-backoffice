import { IRole, IUserBranch } from '@/redux'

export interface IRoleIdAutoSearchProps {
    label: string
    value: { role_uuid: string; role_name: string }
    onSelect: (data: IRole) => void
    disabled?: boolean
    error?: string
}

export interface IUserBranchAutoSearchProps {
    label: string
    value: { branch_uuid: string; branch_name: string }
    onSelect: (data: IUserBranch) => void
    disabled?: boolean
    error?: string
}

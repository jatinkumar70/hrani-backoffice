import { server_base_endpoints } from '@/api'
import axios_base_api from '@/api/axios-base-api'
import { Select } from '@/components/ui'
import { ISecurityRoleGroup } from '@/redux'
import React, { useEffect, useState } from 'react'
import { ActionMeta, SingleValue } from 'react-select'

const fetchSecurityRoleGroupAsync = () => new Promise<ISecurityRoleGroup[]>((resolve, reject) => {
    axios_base_api.get(`${server_base_endpoints.security.get_role_groups}?pageNo=1&itemPerPage=100`).then((response) => {
        resolve(response.data.data)
    }).catch((error) => {
        reject([])
    }).finally(() => {
        resolve([])
    })

})

interface IRoleGroupSelectorProps {
    value: string,
    onSelect: (option: string) => void
}
export const RoleGroupSelector: React.FC<IRoleGroupSelectorProps> = ({ value, onSelect }) => {
    const [roleGroupOptions, setroleGroupOptions] = useState<ISecurityRoleGroup[]>([])

    useEffect(() => {
        fetchSecurityRoleGroupAsync().then((data) => {
            setroleGroupOptions(data)
        })
    }, [])

    return (
        <Select
            name="role_group"
            options={roleGroupOptions.map((option) => ({ value: option.role_group, label: option.role_group })) as any}
            value={roleGroupOptions.find((option) => option.role_group === value)?.role_group || undefined}
            onChange={(newValue: SingleValue<string>, actionMeta: ActionMeta<string>) => {
                console.log("roleGroupsOptions ==>", newValue)
                onSelect(newValue as string)
            }}
        />
    )
}

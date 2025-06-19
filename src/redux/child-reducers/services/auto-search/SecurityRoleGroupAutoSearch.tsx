import { useAppDispatch } from '@/redux/store.hooks'
import { api } from '@/utils/api'
import React, { ReactNode } from 'react'

const INITIAL_STATE: ISecurityRoleGroup = {
    role_id: 0,
    role_uuid: '',
    role_name: '',
    role_value: '',
    role_group: '',
    status: '',
    created_by_uuid: '',
    insert_ts: '',
}

export interface ISecurityRoleGroup {
    role_id: number
    role_uuid: string
    role_name: string
    role_value: string
    role_group: string
    status: string
    created_by_uuid: string
    insert_ts: string
}

interface AutoSearchProps {
    label: string
    value: any
    onSelect: (data: ISecurityRoleGroup) => void
    disabled?: boolean
    error?: string
}

export const SecurityRoleGroupAutoSearch: React.FC<AutoSearchProps> = (
    props,
) => {
    const { value, onSelect, label, disabled, error } = props
    const dispatch = useAppDispatch()

    const [options, setOptions] = React.useState<readonly ISecurityRoleGroup[]>(
        [],
    )
    const [loading, setLoading] = React.useState(false)
    const [valueLabel, setValueLabel] = React.useState<string | null>('')

    const fetchSuggestion = async () => {
        setLoading(true)
        try {
            const res = await api.get(
                `/security/get-role-groups?pageNo=1&itemPerPage=40`,
            )
            const data: ISecurityRoleGroup[] = res.data.data

            setOptions(
                removeDuplicateItems(
                    data,
                    'role_group',
                ) as ISecurityRoleGroup[],
            )
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleOnSelect = (
        event: SelectChangeEvent<unknown>,
        child: ReactNode,
    ) => {
        const selectedValue = event.target.value as string
        const selectedOption = options.find(
            (option) => option.role_group === selectedValue,
        )
        if (selectedOption) {
            onSelect(selectedOption)
            setValueLabel(selectedOption.role_group)
        } else {
            onSelect(INITIAL_STATE)
            setValueLabel('')
        }
    }

    React.useEffect(() => {
        if (value) {
            setValueLabel(value)
        } else {
            setValueLabel('')
        }
    }, [value])

    const handleOpen = () => {
        if (options.length === 0) {
            fetchSuggestion()
        }
    }

    return (
        <Box>
            <Box
                display="flex"
                justifyContent={'flex-start'}
                alignItems="center"
            >
                <CustomFormLabel
                    display={'block'}
                >{` ${label}  `}</CustomFormLabel>
            </Box>
            <Box position="relative">
                <ControlledCustomSelect
                    fullWidth
                    value={valueLabel}
                    onChange={handleOnSelect}
                    onOpen={handleOpen}
                    placeholder="Select Delivery Address"
                    options={options.map((item) => {
                        return {
                            label: item.role_group,
                            value: item.role_group as string,
                        }
                    })}
                    disabled={disabled}
                    error={error ? true : false}
                    helperText={error}
                ></ControlledCustomSelect>
                {loading && (
                    <CircularProgress
                        size={20}
                        sx={{
                            position: 'absolute',
                            top: '26%',
                            left: 10,
                            transform: 'translateY(-50%)',
                        }}
                    />
                )}
            </Box>
        </Box>
    )
}

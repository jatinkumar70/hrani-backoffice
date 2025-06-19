import React from 'react'
import { Minus, Plus, Save } from 'lucide-react'
import { IRecordPremissionsRightPanelProps } from './RecordPremissionsRightPanel.types'
import {
    fetchRecordDropdownWithArgsAsync,
    IRecordColumnRelation,
    IRecordFilterValue,
    useAppDispatch,
} from '@/redux'
import { produce } from 'immer'
import { ISelectOption } from '@/types'
import { RightPanel } from '@/components/RightPanel'
import { Label } from '@/components/ui/Label/label'
import { Button, Select } from '@/components/ui'

export const RecordPremissionsRightPanel: React.FC<
    IRecordPremissionsRightPanelProps
> = (props) => {
    const { open, module, onClose } = props

    const [state, setState] = React.useState(module)
    const [saveLoading, setSaveLoading] = React.useState(false)
    const [columns, setColumns] = React.useState<IRecordColumnRelation[]>([])
    const dispatch = useAppDispatch()

    const handleAddPremission = () => {
        const currentIndex = columns.length
        const newColumn = state.column_relation_options[currentIndex]
        const finalColumns = [...columns, newColumn]
        setColumns(finalColumns)
    }

    const handleRemovePremission = () => {
        const finalColumns = [...columns]
        const record = finalColumns.pop()
        if (record) {
            const newState = produce(state, (draftState) => {
                const keys = Object.keys(draftState.filter_values)
                if (keys.length > 0) {
                    delete draftState.filter_values[keys[0]][record.column_key]
                }
            })
            setState(newState)
            setColumns(finalColumns)
        }
    }

    const handleFilterValues = (columnKey: string, selectedValues: any[]) => {
        let finalValues = [...selectedValues]
        if (finalValues.includes('*')) {
            finalValues = ['*']
        }
        const newState = produce(state, (draftstate) => {
            const selectedModule = state
            if (
                selectedModule.filter_values &&
                Object.keys(selectedModule.filter_values).length > 0
            ) {
                const key = Object.keys(selectedModule.filter_values)[0]
                draftstate.filter_values[key][columnKey] = finalValues
            } else {
                draftstate.filter_values = {
                    or: {
                        [columnKey]: finalValues,
                    },
                }
            }
        })

        setState(newState)
    }

    const handleFilterKeyChange = (newKey: string) => {
        const newState = produce(state, (draftstate) => {
            const selectedModule = state

            if (
                selectedModule.filter_values &&
                Object.keys(selectedModule.filter_values).length > 0
            ) {
                const key = Object.keys(selectedModule.filter_values)[0]
                draftstate.filter_values = {
                    [newKey]: selectedModule.filter_values[key],
                }
            } else {
                draftstate.filter_values = {
                    [newKey]: {},
                }
            }
        })

        setState(newState)
    }

    const handleClose = () => {
        onClose()
    }
    const handleSave = () => {
        props.onSave(state)
    }

    React.useEffect(() => {
        const keys = Object.keys(state.filter_values || {})
        if (keys.length > 0) {
            const listKeys = Object.keys(state.filter_values[keys[0]])
            if (listKeys.length > 0) {
                const tempColumns: IRecordColumnRelation[] = []
                for (let col of state.column_relation_options) {
                    if (listKeys.includes(col.column_key)) {
                        tempColumns.push(col)
                    }
                }
                setColumns(tempColumns)
            }
        }
    }, [])

    return (
        <RightPanel
            open={open}
            heading={state.submodule_name}
            width="40%"
            mobileWidth="90%"
            actionButtons={() => (
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-3">
                        <Button
                            disabled={saveLoading}
                            type="button"
                            variant="solid"
                            onClick={handleClose}
                        >
                            Close
                        </Button>
                    </div>
                    <div className="col-span-3">
                        <Button
                            disabled={saveLoading}
                            type="button"
                            variant="solid"
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            )}
        >
            <div className="grid grid-cols-12">
                <div className="col-span-8">
                    <OperationSelect
                        filterValues={state.filter_values || {}}
                        onFilterValueChange={handleFilterKeyChange}
                    />
                </div>
            </div>
            <div className="grid grid-cols-12 mt-5">
                <div className="col-span-12">
                    <div className="flex gap-2 justify-end mb-4">
                        <Button
                            disabled={columns.length === 0}
                            variant="solid"
                            icon={<Minus className="text-xl" />}
                            onClick={handleRemovePremission}
                        ></Button>
                        <Button
                            disabled={
                                columns.length ===
                                state.column_relation_options.length
                            }
                            variant="solid"
                            icon={<Plus className="text-xl" />}
                            onClick={handleAddPremission}
                        ></Button>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow ">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300 w-24">
                                        On
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                        Allow
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                {columns.map((column) => {
                                    const key = Object.keys(
                                        state.filter_values || {},
                                    )[0]
                                    return (
                                        <Row
                                            key={column.field}
                                            column={column}
                                            filterKey={key}
                                            filterValues={state.filter_values}
                                            onFilterValueChange={
                                                handleFilterValues
                                            }
                                        />
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </RightPanel>
    )
}

const Row: React.FC<{
    column: IRecordColumnRelation
    filterKey: string
    filterValues: IRecordFilterValue
    onFilterValueChange: (columnKey: string, selectedValues: any) => void
}> = (props) => {
    const { column, filterValues, filterKey, onFilterValueChange } = props
    const [options, setOptions] = React.useState<ISelectOption[]>([])

    const selectedValues =
        filterKey && filterValues
            ? filterValues[filterKey][column.column_key] || []
            : []
    const dispatch = useAppDispatch()

    const handleSelectChange = (selectedOptions: ISelectOption[]) => {
        const values = selectedOptions.map((option) => option.value)
        onFilterValueChange(column.column_key, values)
    }

    React.useEffect(() => {
        dispatch(
            fetchRecordDropdownWithArgsAsync({
                apiUrl: column.api,
                columnKey: column.column_key,
                columnLabel: column.field,
                onCallback: (isSuccess, data) => {
                    if (isSuccess) {
                        setOptions(data)
                    }
                },
            }),
        )
    }, [])

    const filteredOptions =
        column.column_label === 'User'
            ? options.filter((item) => item.value !== 'self_zone')
            : options

    const selectedOptions = filteredOptions.filter((option) =>
        selectedValues.includes(option.value),
    )

    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-6 py-4 whitespace-nowrap capitalize text-gray-800 dark:text-gray-200">
                {column.column_label}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <Select
                    isMulti
                    options={filteredOptions}
                    value={selectedOptions}
                    onChange={handleSelectChange}
                />
                <div className="flex flex-wrap gap-1 mt-2">
                    {selectedValues.map((value) => {
                        const option = filteredOptions.find(
                            (opt) => opt.value === value,
                        )
                        return option ? (
                            <span
                                key={value}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            >
                                {option.label}
                            </span>
                        ) : null
                    })}
                </div>
            </td>
        </tr>
    )
}

const OperationSelect: React.FC<{
    filterValues: IRecordFilterValue
    onFilterValueChange: (type: string) => void
}> = (props) => {
    const keys = Object.keys(props.filterValues)
    const finalKey = keys.length > 0 ? keys[0] : null

    const typeOptions = [
        { value: 'AND', label: 'AND' },
        { value: 'OR', label: 'OR' },
    ]

    const handleChange = (selectedOption: ISelectOption) => {
        props.onFilterValueChange(selectedOption.value)
    }

    return (
        <div className="flex items-center gap-3 mt-3">
            <Label className="font-semibold text-gray-800 dark:text-gray-200">
                Type
            </Label>
            <Select
                className="w-full"
                options={typeOptions}
                value={typeOptions.find((option) => option.value === finalKey)}
                onChange={handleChange}
            />
        </div>
    )
}

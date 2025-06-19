import { useEffect, useState } from 'react'
import { Button, DatePicker, Dialog, Input, Select } from '@/components/ui'
import { HiOutlineTrash } from 'react-icons/hi'
import { Filter as FilterIcon } from 'lucide-react'
import dayjs from 'dayjs'

export interface Filter {
    column: string
    operator: string
    value: string
    logicalOperator: string
}

export interface FilterConfig {
    columnOptions: { value: string; label: string; type?: string }[]
    operatorOptions: { value: string; label: string }[]
    logicalOperatorOptions: { value: string; label: string }[]
    selectOptions?: Record<string, { value: string; label: string }[]>
}

interface AdvancedFilterProps {
    isFilterActive: boolean
    onApplyFilters: (filters: Filter[]) => void
    onResetFilters: () => void
    config: FilterConfig
    initialFilters?: Filter[]
    quickSearchValues?: Record<string, string>
    quickSearchFields?: { name: string; label: string; type?: string }[]
}

const AdvancedFilter = ({
    isFilterActive,
    onApplyFilters,
    onResetFilters,
    config,
    initialFilters,
    quickSearchValues,
    quickSearchFields = [],
}: AdvancedFilterProps) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [filters, setFilters] = useState<Filter[]>(
        initialFilters?.length
            ? initialFilters
            : [
                  {
                      column: config.columnOptions[0]?.value || '',
                      operator: config.operatorOptions[0]?.value || '',
                      value: '',
                      logicalOperator: 'AND',
                  },
              ],
    )

    // Sync filters when quickSearchValues change
    useEffect(() => {
        if (quickSearchValues && quickSearchFields.length > 0) {
            const newFilters = Object.entries(quickSearchValues)
                .filter(([_, value]) => value.trim() !== '')
                .map(([column, value]) => {
                    const field = quickSearchFields.find(
                        (f) => f.name === column,
                    )
                    let operator = 'CONTAINS'

                    if (field?.type === 'date') {
                        operator = 'EQUAL'
                    } else if (field?.type === 'select') {
                        operator = 'EQUAL'
                    } else if (field?.type === 'number') {
                        operator = 'EQUAL'
                    }

                    return {
                        column,
                        operator,
                        value,
                        logicalOperator: 'AND',
                    }
                })

            if (newFilters.length > 0) {
                setFilters(newFilters)
            }
        }
    }, [quickSearchValues, quickSearchFields])

    const handleAddFilter = () => {
        setFilters([
            ...filters,
            {
                column: config.columnOptions[0]?.value || '',
                operator: config.operatorOptions[0]?.value || '',
                value: '',
                logicalOperator: 'AND',
            },
        ])
    }

    const handleRemoveFilter = (index: number) => {
        const newFilters = [...filters]
        newFilters.splice(index, 1)
        setFilters(newFilters)
    }

    const handleFilterChange = (
        index: number,
        field: keyof Filter,
        value: string,
    ) => {
        const newFilters = [...filters]
        newFilters[index][field] = value
        setFilters(newFilters)
    }

    const getColumnType = (columnValue: string) => {
        const column = config.columnOptions.find(
            (opt) => opt.value === columnValue,
        )
        return column?.type || 'text'
    }

    const renderValueInput = (filter: Filter, index: number) => {
        const columnType = getColumnType(filter.column)

        switch (columnType) {
            case 'select': {
                const options = config.selectOptions?.[filter.column] || []
                return (
                    <Select
                        options={options}
                        value={options.find(
                            (opt) => opt.value === filter.value,
                        )}
                        onChange={(option) =>
                            handleFilterChange(
                                index,
                                'value',
                                option?.value || '',
                            )
                        }
                        placeholder="Select value"
                    />
                )
            }
            case 'date':
                return (
                    <DatePicker
                        placeholder="Select date"
                        value={
                            filter.value ? new Date(filter.value) : undefined
                        }
                        onChange={(date) => {
                            const dateString = date
                                ? dayjs(date).format('YYYY-MM-DD')
                                : ''
                            handleFilterChange(index, 'value', dateString)
                        }}
                    />
                )
            case 'number':
                return (
                    <Input
                        value={filter.value}
                        type="number"
                        onChange={(e) =>
                            handleFilterChange(index, 'value', e.target.value)
                        }
                        placeholder="Enter value"
                    />
                )
            default:
                return (
                    <Input
                        value={filter.value}
                        onChange={(e) =>
                            handleFilterChange(index, 'value', e.target.value)
                        }
                        placeholder="Enter value"
                    />
                )
        }
    }

    const handleSearch = () => {
        onApplyFilters(filters)
        setDialogOpen(false)
    }

    const handleReset = () => {
        setFilters([
            {
                column: config.columnOptions[0]?.value || '',
                operator: config.operatorOptions[0]?.value || '',
                value: '',
                logicalOperator: 'AND',
            },
        ])
        onResetFilters()
        setDialogOpen(false)
    }

    return (
        <>
            <Button
                variant="solid"
                icon={<FilterIcon className="text-xl" />}
                className={isFilterActive ? 'relative' : ''}
                onClick={() => setDialogOpen(true)}
            >
                <span>Advanced Filter</span>
                {isFilterActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
            </Button>

            <Dialog
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                width={1000}
                className="max-w-[95vw]"
                // className="max-w-[95vw] "
            >
                <div className="flex justify-between items-center">
                    <h4 className="text-lg md:text-xl">Advanced Search</h4>
                    <button
                        className="md:hidden p-1 rounded-full hover:bg-gray-100"
                        onClick={() => setDialogOpen(false)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
                <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto md:overflow-y-visible  md:max-h-[60vh] ">
                    {filters.map((filter, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end"
                        >
                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium mb-1">
                                    Column
                                </label>
                                <Select
                                    options={config.columnOptions}
                                    value={config.columnOptions.find(
                                        (opt) => opt.value === filter.column,
                                    )}
                                    onChange={(option) =>
                                        handleFilterChange(
                                            index,
                                            'column',
                                            option?.value || '',
                                        )
                                    }
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">
                                    Operator
                                </label>
                                <Select
                                    options={config.operatorOptions}
                                    value={config.operatorOptions.find(
                                        (opt) => opt.value === filter.operator,
                                    )}
                                    onChange={(option) =>
                                        handleFilterChange(
                                            index,
                                            'operator',
                                            option?.value || '',
                                        )
                                    }
                                />
                            </div>
                            <div className="md:col-span-5">
                                <label className="block text-sm font-medium mb-1">
                                    Value
                                </label>
                                {renderValueInput(filter, index)}
                            </div>
                            {index > 0 && (
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium mb-1">
                                        Logic
                                    </label>
                                    <Select
                                        options={config.logicalOperatorOptions}
                                        value={config.logicalOperatorOptions.find(
                                            (opt) =>
                                                opt.value ===
                                                filter.logicalOperator,
                                        )}
                                        onChange={(option) =>
                                            handleFilterChange(
                                                index,
                                                'logicalOperator',
                                                option?.value || 'AND',
                                            )
                                        }
                                    />
                                </div>
                            )}
                            <div className="md:col-span-1 flex items-end h-10 justify-end md:justify-start">
                                <Button
                                    shape="circle"
                                    variant="plain"
                                    icon={<HiOutlineTrash />}
                                    onClick={() => handleRemoveFilter(index)}
                                />
                            </div>
                        </div>
                    ))}
                    <div className="flex flex-col-reverse md:flex-row justify-between mt-6 gap-2 sticky bottom-0">
                        <Button
                            onClick={handleAddFilter}
                            className="w-full md:w-auto"
                        >
                            + ADD FILTER
                        </Button>
                        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                            <Button
                                onClick={handleReset}
                                className="w-full md:w-auto"
                            >
                                REMOVE ALL
                            </Button>
                            <Button
                                variant="solid"
                                onClick={handleSearch}
                                className="w-full md:w-auto"
                            >
                                SEARCH
                            </Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default AdvancedFilter

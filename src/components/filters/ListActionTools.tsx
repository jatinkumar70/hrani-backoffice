import { Plus, SearchIcon, RefreshCcw, Filter as FilterIcon } from 'lucide-react'
import AdvancedFilter from './AdvancedFilter'
import { TbCloudDownload } from 'react-icons/tb'
import { CSVLink } from 'react-csv'
import { useEffect, useState } from 'react'
import { Button, DatePicker, Input, Select, Tooltip, Drawer } from '../ui'
import dayjs from 'dayjs'

interface ListActionToolsProps {
    title: string
    onAdd?: () => void
    onRefresh?: () => void
    isRefreshing?: boolean
    lastRefreshed?: string | null
    addButtonText?: string
    advancedFilterConfig: {
        columnOptions: { value: string; label: string; type?: string }[]
        operatorOptions: { value: string; label: string }[]
        logicalOperatorOptions: { value: string; label: string }[]
        selectOptions?: Record<string, { value: string; label: string }[]>
    }
    quickSearchFields: {
        name: string
        label: string
        type?: 'text' | 'select' | 'date' | 'number'
        options?: { value: string; label: string }[]
    }[]
    isFilterActive: boolean
    onAdvancedSearch: (filters: any[]) => void
    onQuickSearch: (searchValues: Record<string, string>) => void
    onResetFilters: () => void
    csvData?: any[]
    activeFilters?: any[]
}

const ListActionTools = ({
    title,
    onAdd,
    onRefresh,
    isRefreshing,
    lastRefreshed,
    addButtonText = 'Add New',
    advancedFilterConfig,
    quickSearchFields,
    isFilterActive,
    onAdvancedSearch,
    onQuickSearch,
    onResetFilters,
    csvData,
    activeFilters,
}: ListActionToolsProps) => {
    const [showQuickSearch, setShowQuickSearch] = useState(false)
    const [quickSearchValues, setQuickSearchValues] = useState<
        Record<string, string>
    >(
        quickSearchFields.reduce(
            (acc, field) => ({ ...acc, [field.name]: '' }),
            {},
        ),
    )
    const [showDrawerFilter, setShowDrawerFilter] = useState(false)
    const [drawerFilterValues, setDrawerFilterValues] = useState(() =>
        advancedFilterConfig.columnOptions.reduce((acc, col) => {
            acc[col.value] = ''
            return acc
        }, {} as Record<string, string>)
    )

    const transformToAdvancedFilters = (values: Record<string, string>) => {
        const entries = Object.entries(values).filter(
            ([_, value]) => value.trim() !== '',
        )

        // Check if both from_date and to_date are present
        const hasFromDate = entries.some(([column]) => column === 'from_date')
        const hasToDate = entries.some(([column]) => column === 'to_date')
        const hasBothDates = hasFromDate && hasToDate

        return entries.map(([column, value]) => {
            const field = quickSearchFields.find((f) => f.name === column)
            let operator = 'CONTAINS'

            // Special handling for date fields
            if (field?.type === 'date') {
                if (hasBothDates) {
                    if (column === 'from_date') {
                        operator = 'GREATER_THAN_EQUAL'
                    } else if (column === 'to_date') {
                        operator = 'LESSER_THAN_EQUAL'
                    } else {
                        operator = 'EQUAL'
                    }
                } else {
                    operator = 'EQUAL' // Use EQUAL if only one date is present
                }
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
    }
    useEffect(() => {
        if (activeFilters && activeFilters.length > 0) {
            // Update quick search values from active filters
            const newQuickSearchValues = { ...quickSearchValues }
            activeFilters.forEach((filter) => {
                if (quickSearchFields.some((f) => f.name === filter.column)) {
                    newQuickSearchValues[filter.column] = filter.value
                }
            })
            setQuickSearchValues(newQuickSearchValues)
        } else {
            // Reset quick search values when no active filters
            setQuickSearchValues(
                quickSearchFields.reduce(
                    (acc, field) => ({ ...acc, [field.name]: '' }),
                    {},
                ),
            )
        }
    }, [activeFilters])

    const handleQuickSearchChange = (field: string, value: string) => {
        setQuickSearchValues({
            ...quickSearchValues,
            [field]: value,
        })
    }

    const handleQuickSearch = () => {
        const filters = transformToAdvancedFilters(quickSearchValues)
        onQuickSearch(quickSearchValues)
        onAdvancedSearch(filters)
        setShowQuickSearch(false)
    }

    const handleQuickSearchReset = () => {
        const emptyState = quickSearchFields.reduce(
            (acc, field) => ({ ...acc, [field.name]: '' }),
            {},
        )
        setQuickSearchValues(emptyState)
        onResetFilters()
    }

    const handleAdvancedSearch = (filters: any[]) => {
        // Update quick search values from advanced filters
        const newQuickSearchValues = { ...quickSearchValues }

        // First reset all quick search values
        quickSearchFields.forEach((field) => {
            newQuickSearchValues[field.name] = ''
        })

        // Then set values from advanced filters
        filters.forEach((filter) => {
            if (quickSearchFields.some((f) => f.name === filter.column)) {
                newQuickSearchValues[filter.column] = filter.value
            }
        })

        setQuickSearchValues(newQuickSearchValues)
        onAdvancedSearch(filters)
    }

    const handleDrawerFilterChange = (field: string, value: string) => {
        setDrawerFilterValues((prev) => ({ ...prev, [field]: value }))
    }

    const handleDrawerApply = () => {
        const filters = advancedFilterConfig.columnOptions
            .filter((col) => drawerFilterValues[col.value]?.toString().trim() !== '')
            .map((col) => ({
                column: col.value,
                operator: col.type === 'select' || col.type === 'date' || col.type === 'number' ? 'EQUAL' : 'CONTAINS',
                value: drawerFilterValues[col.value],
                logicalOperator: 'AND',
            }))
        onAdvancedSearch(filters)
        setShowDrawerFilter(false)
    }

    const handleDrawerClear = () => {
        setDrawerFilterValues(
            advancedFilterConfig.columnOptions.reduce((acc, col) => {
                acc[col.value] = ''
                return acc
            }, {} as Record<string, string>)
        )
        onResetFilters()
        setShowDrawerFilter(false)
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <h3 className="text-2xl font-bold heading-text">{title}</h3>
                <div className="flex flex-col md:flex-row gap-3 justify-end">
                    {csvData && (
                        <CSVLink
                            data={csvData}
                            filename={`${title.toLowerCase()}.csv`}
                            asyncOnClick={true}
                        >
                            <Button
                                className="w-full"
                                icon={<TbCloudDownload className="text-xl" />}
                                disabled={!csvData || csvData.length === 0}
                            >
                                Download
                            </Button>
                        </CSVLink>
                    )}
                    {onAdd && (
                        <Button
                            className="w-full"
                            variant="solid"
                            icon={<Plus className="text-xl" />}
                            onClick={onAdd}
                        >
                            {addButtonText}
                        </Button>
                    )}
                    {onRefresh && (
                        <Tooltip
                            title={`Last refreshed: ${lastRefreshed}`}
                            wrapperClass="flex"
                        >
                            <Button
                                className="w-full"
                                variant="solid"
                                icon={
                                    <RefreshCcw
                                        className={`text-xl ${isRefreshing ? 'animate-spin' : ''}`}
                                    />
                                }
                                onClick={onRefresh}
                                disabled={isRefreshing}
                            >
                                {isRefreshing ? 'Refreshing...' : 'Refresh All'}
                            </Button>
                        </Tooltip>
                    )}

                    <AdvancedFilter
                        isFilterActive={isFilterActive}
                        config={advancedFilterConfig}
                        onApplyFilters={handleAdvancedSearch}
                        onResetFilters={onResetFilters}
                        initialFilters={activeFilters}
                        quickSearchValues={quickSearchValues}
                        quickSearchFields={quickSearchFields}
                    />
                    <Button
                        variant="solid"
                        icon={<SearchIcon className="text-xl" />}
                        onClick={() => setShowQuickSearch(!showQuickSearch)}
                    >
                        Quick Search
                    </Button>
                    <Button
                        variant="default"
                        // className="w-10 h-10 flex items-center justify-center"
                        // icon={<FilterIcon className="text-xl" />}
                        // variant="default"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800"
                        icon={<FilterIcon className="text-xl mr-2" />}
                        onClick={() => setShowDrawerFilter(true)}
                    >
                        Filter
                    </Button>
                </div>
            </div>

            <div className="flex flex-col">{/* status */}</div>

            <div
                className={`transition-all duration-500 ease-in-out ${showQuickSearch
                    ? 'max-h-[500px] opacity-100 visible'
                    : 'max-h-0 opacity-0 invisible pointer-events-none'
                    }`}
                style={{
                    // overflow: 'hidden',
                    position: 'relative',
                    // zIndex: showQuickSearch ? 9999 : -1, // Only bring to front when visible
                }}
            >
                <div className="w-full p-4 border border-[#e5e5e5] rounded-lg relative">
                    <button
                        className="md:hidden absolute right-2 top-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                        onClick={() => setShowQuickSearch(false)}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto max-h-[calc(100vh-500px)] md:max-h-none">
                        {quickSearchFields.map((field) => (
                            <div key={field.name}>
                                {field.type === 'select' ? (
                                    <Select
                                        placeholder={field.label}
                                        name={field.name}
                                        options={field.options || []}
                                        isClearable={true}
                                        menuPortalTarget={document.body}
                                        value={
                                            quickSearchValues[field.name]
                                                ? field.options?.find(
                                                    (option) =>
                                                        option.value ===
                                                        quickSearchValues[
                                                        field.name
                                                        ],
                                                )
                                                : null
                                        }
                                        onChange={(selectedOption) =>
                                            handleQuickSearchChange(
                                                field.name,
                                                selectedOption?.value || '',
                                            )
                                        }
                                    />
                                ) : field.type === 'date' ? (
                                    <DatePicker
                                        placeholder={field.label}
                                        value={
                                            quickSearchValues[field.name]
                                                ? new Date(
                                                    quickSearchValues[
                                                    field.name
                                                    ],
                                                )
                                                : null
                                        }
                                        onChange={(date) => {
                                            const dateString = date
                                                ? dayjs(date).format(
                                                    'YYYY-MM-DD',
                                                )
                                                : ''
                                            handleQuickSearchChange(
                                                field.name,
                                                dateString,
                                            )
                                        }}
                                    />
                                ) : field.type === 'number' ? (
                                    <Input
                                        placeholder={field.label}
                                        value={quickSearchValues[field.name]}
                                        type="number"
                                        onChange={(e) =>
                                            handleQuickSearchChange(
                                                field.name,
                                                e.target.value,
                                            )
                                        }
                                    />
                                ) : (
                                    <Input
                                        placeholder={field.label}
                                        value={quickSearchValues[field.name]}
                                        onChange={(e) =>
                                            handleQuickSearchChange(
                                                field.name,
                                                e.target.value,
                                            )
                                        }
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2 justify-end mt-4 sticky bottom-0 bg-white dark:bg-gray-800 py-2 md:static md:bg-transparent ">
                        <Button
                            className="md:hidden "
                            onClick={() => setShowQuickSearch(false)}
                        >
                            Close
                        </Button>
                        <Button
                            variant="default"
                            onClick={handleQuickSearchReset}
                        >
                            Clear
                        </Button>
                        <Button variant="solid" onClick={handleQuickSearch}>
                            Apply
                        </Button>
                    </div>
                </div>
            </div>

            <Drawer
                isOpen={showDrawerFilter}
                onClose={() => setShowDrawerFilter(false)}
                title="Filter Listings"
                width={400}
            >
                <div className="flex flex-col gap-4 p-2">
                    {advancedFilterConfig.columnOptions.map((col) => {
                        const value = drawerFilterValues[col.value]
                        const selectOptions =
                            col.type === 'select' && advancedFilterConfig.selectOptions && advancedFilterConfig.selectOptions[col.value]
                                ? advancedFilterConfig.selectOptions[col.value]
                                : []
                        return (
                            <div key={col.value} className="flex flex-col gap-1">
                                <label className="text-sm font-medium mb-1">{col.label}</label>
                                {col.type === 'select' ? (
                                    <Select
                                        options={selectOptions}
                                        value={selectOptions.find((opt) => opt.value === value) || null}
                                        onChange={(option) => handleDrawerFilterChange(col.value, option?.value || '')}
                                        isClearable={true}
                                        placeholder={`Select ${col.label}`}
                                    />
                                ) : col.type === 'date' ? (
                                    <DatePicker
                                        value={value ? new Date(value) : null}
                                        onChange={(date) => handleDrawerFilterChange(col.value, date ? dayjs(date).format('YYYY-MM-DD') : '')}
                                        placeholder={`Select ${col.label}`}
                                    />
                                ) : col.type === 'number' ? (
                                    <Input
                                        // type="number"
                                        value={value}
                                        onChange={(e) => handleDrawerFilterChange(col.value, e.target.value)}
                                        placeholder={`Enter ${col.label}`}
                                    />
                                ) : (
                                    <Input
                                        value={value}
                                        onChange={(e) => handleDrawerFilterChange(col.value, e.target.value)}
                                        placeholder={`Enter ${col.label}`}
                                    />
                                )}
                            </div>
                        )
                    })}
                    <div className="flex gap-2 justify-end mt-4">
                        <Button variant="default" onClick={handleDrawerClear}>Clear</Button>
                        <Button variant="solid" onClick={handleDrawerApply}>Apply Filter</Button>
                    </div>
                </div>
            </Drawer>
        </div>
    )
}

export default ListActionTools

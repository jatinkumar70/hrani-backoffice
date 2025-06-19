import { useState, useMemo } from 'react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Drawer from '@/components/ui/Drawer'
import { TbFilter, TbPlus, TbTrash, TbSearch, TbX } from 'react-icons/tb'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import React from 'react'

export interface FilterColumn {
  label: string
  value: string
}

export interface AdvancedFilterItem {
  column: string[]
  value: string
  logicalOperator: 'AND' | 'OR'
  operator: string
}

interface AdvancedFilterProps {
  state: AdvancedFilterItem[]
  onChange: (filters: AdvancedFilterItem[]) => void
  columns: FilterColumn[]
  operators: { label: string; value: string }[]
  excludeColumnsInSearch?: string[]
  additionalColumns?: Array<FilterColumn & { placementIndex?: number }>
  loadInitialFilterOncePopoverOpened?: AdvancedFilterItem[]
  showMyRecordsButton?: {
    columnName: string
    currentUserId: string
  }
}

const customSelectStyles = {
  control: (provided: any) => ({
    ...provided,
    minHeight: '38px',
    height: '38px',
    borderRadius: '8px',
    boxShadow: 'none',
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '2px 8px',
    flexWrap: 'wrap',
    minHeight: '38px',
    height: '38px',
    alignItems: 'center',
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: '#f3f4f6',
    borderRadius: '6px',
    padding: '0 4px',
    margin: '2px 2px',
    fontSize: '13px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
  }),
  input: (provided: any) => ({
    ...provided,
    margin: '0px',
    padding: '0px',
  }),
  indicatorsContainer: (provided: any) => ({
    ...provided,
    height: '38px',
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    padding: '4px',
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    padding: '4px',
  }),
  menu: (provided: any) => ({
    ...provided,
    zIndex: 9999,
  }),
}

export const AdvancedFilter = ({
  state = [],
  columns,
  operators,
  onChange,
  excludeColumnsInSearch = [],
  additionalColumns = [],
  loadInitialFilterOncePopoverOpened,
  showMyRecordsButton,
}: AdvancedFilterProps) => {
  const [searchFilterState, setSearchFilterState] = useState<AdvancedFilterItem[]>(state || [])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const filteredColumns = useMemo(() => {
    let columnsList = columns.filter(
      (col) => !excludeColumnsInSearch.includes(col.value)
    )
    for (const column of additionalColumns) {
      if (column.placementIndex !== undefined) {
        columnsList.splice(column.placementIndex, 0, column)
      } else {
        columnsList.push(column)
      }
    }
    return columnsList
  }, [columns, excludeColumnsInSearch, additionalColumns])

  const isShowAllChecked = showMyRecordsButton &&
    state.length > 0 &&
    state[0].column.includes(showMyRecordsButton.columnName)

  const executeSearch = (
    newState: AdvancedFilterItem[],
    preventDialogToggle?: boolean
  ) => {
    if (!isEqual(state, newState)) {
      onChange(newState)
      if (!preventDialogToggle) {
        setIsDrawerOpen(false)
      }
    }
  }

  const handleSearch = () => {
    executeSearch(searchFilterState)
  }

  const handleOpenFilter = () => {
    if (!isDrawerOpen) {
      let initialColumns: AdvancedFilterItem[] = []
      if (loadInitialFilterOncePopoverOpened && state.length === 0) {
        initialColumns = loadInitialFilterOncePopoverOpened
      } else {
        initialColumns = [
          {
            column: [],
            value: '',
            logicalOperator: 'AND',
            operator: operators[0]?.value || '',
          },
        ]
      }
      setSearchFilterState(state.length > 0 ? state : initialColumns)
    }
    setIsDrawerOpen(!isDrawerOpen)
  }

  const handleTextChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchFilterState(prevState => {
      const newState = [...prevState]
      newState[index] = {
        ...newState[index],
        value
      }
      return newState
    })
  }

  const handleColumnChange = (index: number) => (value: string[]) => {
    setSearchFilterState(prevState => {
      const newState = [...prevState]
      newState[index] = {
        ...newState[index],
        column: value,
        value: ''
      }
      return newState
    })
  }

  const handleOperatorChange = (index: number) => (value: string) => {
    setSearchFilterState(prevState => {
      const newState = [...prevState]
      newState[index] = {
        ...newState[index],
        operator: value
      }
      return newState
    })
  }

  const handleAdd = () => {
    setSearchFilterState(prevState => [
      ...prevState,
      {
        column: [],
        value: '',
        logicalOperator: 'AND',
        operator: operators[0]?.value || '',
      }
    ])
  }

  const handleRemove = (index: number) => () => {
    if (index < 0) {
      setSearchFilterState([])
      onChange([])
      setIsDrawerOpen(false)
    } else {
      setSearchFilterState(prevState => {
        const newState = [...prevState]
        newState.splice(index, 1)
        return newState
      })
    }
  }

  const handleShowMyRecords = () => {
    if (showMyRecordsButton) {
      if (isShowAllChecked) {
        executeSearch([], true)
        return
      }
      executeSearch(
        [
          ...state,
          {
            column: [showMyRecordsButton.columnName],
            operator: operators[0]?.value || '',
            logicalOperator: 'AND',
            value: showMyRecordsButton.currentUserId,
          },
        ],
        true
      )
    }
  }

  const isMultipleFilters = searchFilterState.length > 1

  return (
    <div className="relative">
      {/* <Badge content={state.length > 0 ? state.length : undefined}> */}
        <Button
          onClick={handleOpenFilter}
          variant={state.length > 0 ? "solid" : "default"}
          className={`flex items-center space-x-1 py-2 ${state.length > 0 ? 'bg-primary text-white' : ''}`}
          icon={<TbFilter />}
        >
          <span className="font-semibold">Filter</span>
          {state.length > 0 && (
            <span className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
              {state.length} active
            </span>
          )}
        </Button>
      {/* </Badge> */}

      <Drawer
        title={
          <div className="flex items-center justify-between">
            <span>Advanced Filter</span>
            {state.length > 0 && (
              <Button
                variant="plain"
                size="sm"
                onClick={handleRemove(-1)}
                className="text-red-500"
                icon={<TbTrash />}
              >
                Clear All
              </Button>
            )}
          </div>
        }
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        width={700}
      >
        <div>
          {showMyRecordsButton && (
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <div className="relative inline-block h-4 w-8">
                  <input
                    type="checkbox"
                    className="peer h-4 w-8 cursor-pointer appearance-none rounded-full bg-gray-200 transition-colors duration-200 checked:bg-primary dark:bg-gray-700 dark:checked:bg-primary"
                    checked={isShowAllChecked}
                    onChange={handleShowMyRecords}
                  />
                  <span className="pointer-events-none absolute left-0 top-0 block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 peer-checked:translate-x-4 dark:bg-gray-400"></span>
                </div>
                <span className="text-base font-semibold text-primary">Show My Records</span>
              </div>
              {isShowAllChecked && (
                <div className="flex justify-center mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 w-4/5 text-center">
                    Currently displaying only your records. To apply additional filters, turn off 'Show My Records'
                  </p>
                </div>
              )}
            </div>
          )}

          {!isShowAllChecked && (
            <>
              {searchFilterState.map((filter, index) => (
                <div key={index} className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg w-full max-w-3xl mx-auto">
                  <div className="grid grid-cols-12 gap-2 md:gap-4 items-end">
                    <div className="col-span-1 flex items-end justify-center">
                      <button
                        onClick={handleRemove(index)}
                        className="mb-4 bg-gray-200 rounded-full p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                      >
                        <TbX className="text-lg" />
                      </button>
                    </div>

                    {isMultipleFilters && index > 0 && (
                      <div className="col-span-2 flex items-end">
                        <Select
                          styles={customSelectStyles}
                          value={filter.logicalOperator}
                          onChange={(val: any) => {
                            setSearchFilterState(prevState => {
                              const newState = [...prevState]
                              newState[index] = {
                                ...newState[index],
                                logicalOperator: val.value
                              }
                              return newState
                            })
                          }}
                          className="w-full min-w-[90px]"
                          options={[
                            { label: 'AND', value: 'AND' },
                            { label: 'OR', value: 'OR' },
                          ]}
                        />
                      </div>
                    )}
                    {isMultipleFilters && index === 0 && <div className="col-span-2" />}

                    <div className={`col-span-${isMultipleFilters ? '4' : '5'}`}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Columns
                      </label>
                      <Select
                        isMulti
                        styles={customSelectStyles}
                        value={filter.column.map(col => filteredColumns.find(c => c.value === col))}
                        onChange={(val: any) => {
                          const values = Array.isArray(val) ? val.map((option: any) => option.value) : []
                          handleColumnChange(index)(values)
                        }}
                        className="w-full min-w-[180px]"
                        options={filteredColumns}
                        placeholder="Select Column"
                        menuPlacement="auto"
                      />
                    </div>

                    <div className={`col-span-${isMultipleFilters ? '2' : '3'}`}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Operator
                      </label>
                      <Select
                        styles={customSelectStyles}
                        value={operators.find(op => op.value === filter.operator)}
                        onChange={(val: any) => {
                          const value = val?.value || operators[0]?.value || ''
                          handleOperatorChange(index)(value)
                        }}
                        className="w-full min-w-[160px]"
                        options={operators}
                        placeholder="Select Operator"
                        menuPlacement="auto"
                      />
                    </div>

                    <div className={`col-span-${isMultipleFilters ? '3' : '3'}`}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Value
                      </label>
                      <Input
                        value={filter.value}
                        onChange={handleTextChange(index)}
                        placeholder="Enter value"
                        className="w-full min-w-[140px]"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between mt-4">
                <Button
                  variant="plain"
                  className="font-semibold"
                  onClick={handleAdd}
                  icon={<TbPlus />}
                >
                  Add Filter
                </Button>
                <Button
                  variant="solid"
                  className="font-semibold"
                  onClick={handleSearch}
                  icon={<TbSearch />}
                >
                  Apply Filters
                </Button>
              </div>
            </>
          )}
        </div>
      </Drawer>
    </div>
  )
}

export default AdvancedFilter 
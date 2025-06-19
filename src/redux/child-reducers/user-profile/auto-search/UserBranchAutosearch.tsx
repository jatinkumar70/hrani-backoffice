import React from 'react'
import { debounce } from 'lodash'

import { IUserBranchAutoSearchProps } from './AutoCompleteSearches.types'
import { IUserBranch } from '@/redux'
import axios_base_api from '@/api/axios-base-api'
import { server_base_endpoints } from '@/api'

const INITIAL_STATE: IUserBranch = {
    branch_name: '',
    branch_uuid: '',
    status: '',
    create_ts: '',
    insert_ts: '',
}

export const UserBranchAutosearch: React.FC<IUserBranchAutoSearchProps> = (
    props,
) => {
    const { label, value, onSelect, disabled, error } = props
    const [options, setOptions] = React.useState<readonly IUserBranch[]>([])
    const [loading, setLoading] = React.useState(false)
    const [search, setSearch] = React.useState<string>('')
    const [isOpen, setIsOpen] = React.useState(false)
    const [fieldValue, setFieldValue] = React.useState<IUserBranch | null>(null)

    const fetchSuggestion = async (value: string) => {
        setLoading(true)
        try {
            let newUrl = `${server_base_endpoints.data_management.get_branch}?pageNo=1&itemPerPage=20`

            if (value.length > 0) {
                newUrl += `?columns=branch_name&value=${value}`
            }

            const res = await axios_base_api.get(newUrl)
            const finalData: IUserBranch[] = res.data.data
            setOptions(finalData)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const debounceFn = React.useCallback(debounce(fetchSuggestion, 800), [])

    const getOptionLabel = (option: IUserBranch) => {
        return option.branch_name
    }

    React.useEffect(() => {
        if (search && search !== value.branch_name && search.length > 1) {
            debounceFn(search)
        } else if (search === '') {
            debounceFn('')
        }
    }, [search])

    React.useEffect(() => {
        fetchSuggestion('')
    }, [])

    React.useEffect(() => {
        if (
            value &&
            typeof value === 'object' &&
            value?.branch_uuid?.length > 0
        ) {
            const option: IUserBranch = {
                ...INITIAL_STATE,
                branch_uuid: value.branch_uuid,
                branch_name: value.branch_name,
            }
            setOptions([option])
            setFieldValue(option)
        } else {
            setFieldValue(null)
        }
    }, [value])

    // Added this function to handle input changes properly
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setSearch(newValue)

        // If input is cleared, reset the selection
        if (newValue === '') {
            onSelect({
                ...INITIAL_STATE,
                branch_name: '',
                branch_uuid: '',
            })
        }
    }

    // Added this function to handle clearing the input
    const handleClearInput = () => {
        setSearch('')
        setFieldValue(null)
        onSelect({
            ...INITIAL_STATE,
            branch_name: '',
            branch_uuid: '',
        })
    }

    return (
        <div className="w-full">
            {label && (
                <div className="flex justify-start items-center">
                    <label className="block text-sm font-medium text-gray-700">
                        {label}
                    </label>
                </div>
            )}

            <div className="relative w-full">
                <div className="relative">
                    <input
                        type="text"
                        className={`w-full p-4 text-sm text-black font-[600] rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-100 ${
                            disabled
                                ? 'bg-gray-100 cursor-not-allowed'
                                : 'bg-gray-100'
                        } ${error ? 'border-red-500' : 'border-gray-300'}`}
                        value={
                            search || (fieldValue ? fieldValue.branch_name : '')
                        }
                        onChange={handleInputChange}
                        onFocus={() => setIsOpen(true)}
                        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                        disabled={disabled}
                        placeholder="Search branches..."
                    />
                    {/* Added clear button when there's a value */}
                    {(search || fieldValue) && !disabled && (
                        <button
                            type="button"
                            className="absolute inset-y-0 right-6 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                            onClick={handleClearInput}
                        >
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                    {loading && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <div className="animate-spin rounded-full h-4 w-4 "></div>
                        </div>
                    )}
                </div>

                {isOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg border-none rounded-md py-2 text-base  overflow-auto focus:outline-none sm:text-sm max-h-60">
                        {options.length === 0 && !loading ? (
                            <div className="px-4 py-2 text-gray-700">
                                No branches found
                            </div>
                        ) : (
                            options.map((option) => (
                                <div
                                    key={option.branch_uuid}
                                    className={`px-4 py-3 font-[600] hover:text-black cursor-pointer  ${
                                        fieldValue?.branch_uuid ===
                                        option.branch_uuid
                                            ? 'bg-blue-50'
                                            : ''
                                    }`}
                                    onClick={() => {
                                        onSelect(option)
                                        setFieldValue(option)
                                        setIsOpen(false)
                                    }}
                                >
                                    {getOptionLabel(option)}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
        </div>
    )
}

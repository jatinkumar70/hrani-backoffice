import React from 'react'

import { IRoleIdAutoSearchProps } from './AutoCompleteSearches.types'
import { IRole } from '@/redux'
import { server_base_endpoints } from '@/api'
import axios_base_api from '@/api/axios-base-api'
import { debounce } from 'lodash'
import { HiCheck, HiChevronDown, HiX } from 'react-icons/hi'
import { Spinner } from '@/components/ui'
import { cn } from '@/lib/utils'

export const INITIAL_STATE: IRole = {
    role_id: 0,
    role_uuid: '',
    role_name: '',
    role_value: '',
    role_group: '',
    role_json: '',
    status: '',
}

export const RoleIdAutoSearch: React.FC<IRoleIdAutoSearchProps> = (props) => {
    const { label, value, onSelect, disabled, error } = props

    const [loading, setLoading] = React.useState(false)
    const [options, setOptions] = React.useState<readonly IRole[]>([])
    const [fieldValue, setFieldValue] = React.useState<IRole | null>(null)
    const [search, setSearch] = React.useState<string>('')
    const [isOpen, setIsOpen] = React.useState(false)

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    const fetchSuggestion = async (value: string) => {
        setLoading(true)
        try {
            let newUrl = `${server_base_endpoints.security.get_roles}?pageNo=1&itemPerPage=20`

            if (value.length > 0) {
                newUrl += `&columns=role_name&value=${value}`
            }
            const res = await axios_base_api.get(newUrl)
            const finalData: IRole[] = res.data.data
            setOptions(finalData)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching data:', error)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    const debounceFn = React.useCallback(debounce(fetchSuggestion, 800), [])

    const getOptionLabel = (option: IRole) => {
        return option.role_name
    }

    React.useEffect(() => {
        if (search && search !== value.role_name && search.length > 1) {
            debounceFn(search)
        } else if (search === '') {
            // Added this condition to fetch options when search is cleared
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
            value?.role_uuid?.length > 0
        ) {
            const option: IRole = {
                ...INITIAL_STATE,
                role_uuid: value.role_uuid,
                role_name: value.role_name,
            }
            setOptions([option])
            setFieldValue(option)
        } else {
            // Added this to clear the field when value is empty
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
                role_uuid: '',
                role_name: '',
            })
        }
    }

    // Added this function to handle clearing the input
    const handleClearInput = () => {
        setSearch('')
        setFieldValue(null)
        onSelect({
            ...INITIAL_STATE,
            role_uuid: '',
            role_name: '',
        })
    }

    return (
        <div className="w-full">
            {label && (
                <div className="flex justify-start items-center">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        {label}
                    </label>
                </div>
            )}
            <div className="relative w-full">
                <div className="relative">
                    <input
                        type="text"
                        className={`w-full p-4 text-sm text-black font-[600]  rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-100 ${
                            disabled
                                ? 'bg-gray-100 cursor-not-allowed'
                                : 'bg-gray-100'
                        } ${error ? 'border-red-500' : 'border-gray-300'}`}
                        value={
                            search || (fieldValue ? fieldValue.role_name : '')
                        }
                        disabled={disabled}
                        placeholder="Search roles..."
                        onChange={handleInputChange}
                        onFocus={() => setIsOpen(true)}
                        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    />

                    {(search || fieldValue) && !disabled && (
                        <button
                            type="button"
                            className="absolute inset-y-0 right-6 flex items-center pr-3  text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 "
                            onClick={handleClearInput}
                        >
                            <HiX className="h-4 w-4" />
                        </button>
                    )}

                    {!fieldValue && !loading && (
                        <button
                            type="button"
                            className="absolute inset-y-0 right-6 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            onClick={toggleDropdown}
                        >
                            <HiChevronDown className="h-5 w-5" />
                        </button>
                    )}

                    {loading && (
                        <div className="absolute inset-y-0 right-6 flex items-center pr-3">
                            <Spinner className="text-primary" />
                        </div>
                    )}
                </div>
                {isOpen && (
                    <div
                        className={cn(
                            'absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg py-3 px-3 text-base',
                            'overflow-auto focus:outline-none sm:text-sm max-h-60 border-none',
                        )}
                    >
                        {options.length === 0 && !loading ? (
                            <div className="px-4 py-2 text-gray-700  dark:text-gray-300">
                                No roles found
                            </div>
                        ) : (
                            options.map((option) => (
                                <div
                                    key={option.role_uuid}
                                    className={cn(
                                        'px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer',
                                        'flex items-center justify-between',
                                        fieldValue?.role_uuid ===
                                            option.role_uuid
                                            ? 'bg-primary-subtle text-primary dark:bg-primary dark:bg-opacity-20'
                                            : 'text-gray-900 dark:text-gray-100',
                                    )}
                                    onClick={() => {
                                        onSelect(option)
                                        setFieldValue(option)
                                        setSearch(option.role_name)
                                        setIsOpen(false)
                                    }}
                                >
                                    <span>{getOptionLabel(option)}</span>
                                    {fieldValue?.role_uuid ===
                                        option.role_uuid && (
                                        <HiCheck className="text-xl text-primary" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
                {error && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {error}
                    </p>
                )}
            </div>
        </div>
    )
}

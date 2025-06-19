'use client'

import type React from 'react'

import { useCallback, useState, useEffect } from 'react'

import {
    ChevronUp,
    ChevronDown,
    Wifi,
    Tv,
    Utensils,
    TreePine,
    Shield,
    Sofa,
    Bath,
    Monitor,
    Gamepad,
    Trash2,
    HelpCircle,
    Home,
} from 'lucide-react'
import { IProperty } from '@/redux/child-reducers/property'
import { api } from '@/utils/api'
import AmenityIcon from '@/components/ui/AmenityIcon'

interface Props {
    setFieldValue: (field: string, value: any) => void
    values: IProperty
}

interface Amenity {
    master_amenities_uuid: string
    name: string
    code: string
    icon: string
    category: string
}

interface CategoryAmenities {
    category: string
    amenities: Amenity[]
}

interface SelectedAmenities {
    [key: string]: boolean
}

interface ExpandedCategories {
    [key: string]: boolean
}

export function PropertyFormStepFive({ setFieldValue, values }: Props) {
    const [masterAmenities, setMasterAmenities] = useState<CategoryAmenities[]>(
        [],
    )
    const [expandedCategories, setExpandedCategories] =
        useState<ExpandedCategories>({})
    const [selectedAmenities, setSelectedAmenities] =
        useState<SelectedAmenities>(
            // Initialize with current amenities
            (values.amenities || []).reduce(
                (acc: SelectedAmenities, category) => {
                    category.amenities.forEach((amenity) => {
                        acc[amenity.master_amenities_uuid] = true
                    })
                    return acc
                },
                {},
            ),
        )
    const [allExpanded, setAllExpanded] = useState(false)

    const toggleCategory = useCallback(
        (category: string, e: React.MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setExpandedCategories((prev) => ({
                ...prev,
                [category]: !prev[category],
            }))
        },
        [],
    )

    useEffect(() => {
        const fetchMasterAmenities = async () => {
            try {
                const response = await api.get(
                    '/property/get-master-amenities?is_transform_data=true&pageNo=1&itemPerPage=200',
                )
                setMasterAmenities(response.data.data)
                // Initialize all categories as expanded by default
                // const initialExpandedState = response.data.data.reduce(
                //     (acc: ExpandedCategories, category: CategoryAmenities) => {
                //         acc[category.category] = true
                //         return acc
                //     },
                //     {},
                // )
                // setExpandedCategories(initialExpandedState)
            } catch (error) {
                console.error('Error fetching master amenities:', error)
            }
        }
        fetchMasterAmenities()
    }, [])

    const handleAmenityToggle = useCallback(
        (
            amenityUuid: string,
            checked: boolean,
            category: string,
            amenityData: Amenity,
        ) => {
            setSelectedAmenities((prev) => ({
                ...prev,
                [amenityUuid]: checked,
            }))

            const currentAmenities = JSON.parse(
                JSON.stringify(values.amenities || []),
            )
            let targetCategory = currentAmenities.find(
                (cat: { category: string }) => cat.category === category,
            )

            if (!targetCategory) {
                targetCategory = { category, amenities: [] }
                currentAmenities.push(targetCategory)
            }

            if (checked) {
                if (
                    !targetCategory.amenities.some(
                        (a: Amenity) => a.master_amenities_uuid === amenityUuid,
                    )
                ) {
                    targetCategory.amenities.push(amenityData)
                }
            } else {
                targetCategory.amenities = targetCategory.amenities.filter(
                    (a: Amenity) => a.master_amenities_uuid !== amenityUuid,
                )
            }

            setFieldValue('amenities', currentAmenities)
        },
        [setFieldValue, values.amenities],
    )

    const handleRemoveAmenity = useCallback(
        (e: React.MouseEvent, amenityUuid: string, category: string) => {
            e.preventDefault()
            e.stopPropagation()

            setSelectedAmenities((prev) => ({ ...prev, [amenityUuid]: false }))

            const currentAmenities = JSON.parse(
                JSON.stringify(values.amenities || []),
            )
            const targetCategory = currentAmenities.find(
                (cat: { category: string }) => cat.category === category,
            )

            if (targetCategory) {
                targetCategory.amenities = targetCategory.amenities.filter(
                    (a: Amenity) => a.master_amenities_uuid !== amenityUuid,
                )
                setFieldValue('amenities', currentAmenities)
            }
        },
        [setFieldValue, values.amenities],
    )

    // Get count of selected amenities per category
    const getCategorySelectedCount = (category: string) => {
        const masterCategory = masterAmenities.find(
            (cat) => cat.category === category,
        )
        if (!masterCategory) return { selected: 0, total: 0 }

        const total = masterCategory.amenities.length
        const selected = masterCategory.amenities.filter(
            (amenity) => selectedAmenities[amenity.master_amenities_uuid],
        ).length

        return { selected, total }
    }

    // Count total selected amenities
    const selectedCount =
        Object.values(selectedAmenities).filter(Boolean).length
    const totalAmenities =
        masterAmenities.reduce(
            (sum, category) => sum + (category.amenities?.length || 0),
            0,
        ) || 0
    const progressPercentage =
        totalAmenities > 0 ? (selectedCount / totalAmenities) * 100 : 0

    // Get category icon
    const getCategoryIcon = (category: string) => {
        const categoryLower = category.toLowerCase()
        switch (categoryLower) {
            case 'basic':
                return <Wifi className="text-blue-600 text-base sm:text-lg" />
            case 'kitchen & dining':
            case 'kitchen':
                return (
                    <Utensils className="text-blue-600 text-base sm:text-lg" />
                )
            case 'outdoor':
                return (
                    <TreePine className="text-blue-600 text-base sm:text-lg" />
                )
            case 'safety & security':
            case 'safety':
                return <Shield className="text-blue-600 text-base sm:text-lg" />
            case 'living spaces':
                return <Sofa className="text-blue-600 text-base sm:text-lg" />
            case 'bathroom':
                return <Bath className="text-blue-600 text-base sm:text-lg" />
            case 'entertainment':
                return (
                    <Monitor className="text-blue-600 text-base sm:text-lg" />
                )
            default:
                return <Home className="text-blue-600 text-base sm:text-lg" />
        }
    }

    // Format category name
    const formatCategoryName = (name: string) => {
        return name
            .split('_')
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
            )
            .join(' ')
    }

    const getAmenityIconComponent = (icon: string) => {
        const iconName = icon?.replace('fa-', '') || 'check'
        switch (iconName) {
            case 'wifi':
                return <Wifi className="text-sm" />
            case 'tv':
                return <Tv className="text-sm" />
            case 'utensils':
                return <Utensils className="text-sm" />
            case 'tree':
                return <TreePine className="text-sm" />
            case 'shield-alt':
                return <Shield className="text-sm" />
            case 'couch':
                return <Sofa className="text-sm" />
            case 'bath':
                return <Bath className="text-sm" />
            case 'gamepad':
                return <Gamepad className="text-sm" />
            case 'trash-alt':
                return <Trash2 className="text-sm" />
            default:
                return <HelpCircle className="text-sm" />
        }
    }

    // Function to toggle all categories
    const toggleAllCategories = () => {
        const newState = !allExpanded
        setAllExpanded(newState)
        const updated: ExpandedCategories = {}
        masterAmenities.forEach((cat) => {
            updated[cat.category] = newState
        })
        setExpandedCategories(updated)
    }

    // Update allExpanded state when expandedCategories changes
    useEffect(() => {
        if (masterAmenities.length === 0) return
        const allOpen = masterAmenities.every(
            (cat) => expandedCategories[cat.category],
        )
        setAllExpanded(allOpen)
    }, [expandedCategories, masterAmenities])

    return (
        <div className="w-full md:px-4 sm:px-0 lg:px-8">
            {/* Header with progress */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 sm:p-0 mb-6 flex items-center justify-between">
                <div
                    className="flex flex-col w-full"
                    onClick={toggleAllCategories}
                >
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Property Amenities
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1 mb-4">
                        Select all amenities that are available at this
                        property.
                    </p>
                    <div className="flex items-center w-full gap-2">
                        <div className="flex-grow h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                            {selectedCount} of {totalAmenities}
                        </span>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={toggleAllCategories}
                    className="ml-4 p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                    aria-label={allExpanded ? 'Collapse all' : 'Expand all'}
                >
                    {allExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                    ) : (
                        <ChevronDown className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Amenities grid */}
            <div className="columns-1 lg:columns-2 gap-4 sm:gap-6">
                {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"> */}
                {masterAmenities.map((category) => {
                    const { selected, total } = getCategorySelectedCount(
                        category.category,
                    )
                    const isExpanded = expandedCategories[category.category]
                    const formattedCategory = formatCategoryName(
                        category.category,
                    )
                    const amenityCount = category.amenities.length

                    return (
                        <div
                            key={category.category}
                            className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden break-inside-avoid mb-4"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                toggleCategory(category.category, e)
                            }}
                        >
                            {/* Category header */}
                            <div className="flex items-center justify-between p-6 pb-2">
                                <div className="flex items-center gap-2">
                                    {getCategoryIcon(category.category)}
                                    <h3 className="font-medium text-gray-800 dark:text-gray-100 text-base sm:text-lg">
                                        {formattedCategory}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-blue-600 font-medium">
                                        {selected}/{total}
                                    </span>

                                    <button
                                        type="button"
                                        className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 focus:outline-none"
                                        aria-label={
                                            isExpanded ? 'Collapse' : 'Expand'
                                        }
                                    >
                                        {isExpanded ? (
                                            <ChevronUp className="w-4 h-4" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Amenities list */}
                            {isExpanded && (
                                <div className="px-6 pb-6">
                                    <div className="space-y-2">
                                        {category.amenities.map((amenity) => {
                                            const isSelected =
                                                !!selectedAmenities[
                                                    amenity
                                                        .master_amenities_uuid
                                                ]
                                            const formattedName =
                                                formatCategoryName(amenity.name)

                                            return (
                                                <div
                                                    key={
                                                        amenity.master_amenities_uuid
                                                    }
                                                    className={`flex items-center justify-between p-3 rounded-md ${isSelected ? 'bg-blue-50 dark:bg-blue-900' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                                >
                                                    <label className="flex items-center cursor-pointer flex-grow">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={(e) =>
                                                                handleAmenityToggle(
                                                                    amenity.master_amenities_uuid,
                                                                    e.target
                                                                        .checked,
                                                                    category.category,
                                                                    amenity,
                                                                )
                                                            }
                                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        />

                                                        <div className="flex items-center ml-3">
                                                            <div
                                                                className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 sm:mr-3 ${isSelected ? 'bg-blue-100 dark:bg-blue-800 text-blue-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}
                                                            >
                                                                <AmenityIcon
                                                                    icon={
                                                                        amenity.icon
                                                                    }
                                                                    size={20}
                                                                />
                                                            </div>
                                                            <span className="text-gray-700 dark:text-gray-200 text-sm sm:text-base">
                                                                {formattedName}
                                                            </span>
                                                        </div>
                                                    </label>

                                                    {isSelected && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) =>
                                                                handleRemoveAmenity(
                                                                    e,
                                                                    amenity.master_amenities_uuid,
                                                                    category.category,
                                                                )
                                                            }
                                                            className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 focus:outline-none"
                                                            aria-label={`Remove ${formattedName}`}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

import { fetchMultiplePropertiesWithArgsAsync } from '@/redux/child-reducers/property'
import { useAppDispatch, useAppSelector } from '@/redux/store.hooks'
import { usePropertyListStore } from '../store/propertyListStore'
import type { TableQueries } from '@/@types/common'
import { ILoadState } from '@/redux/store.enums'
import type { AdvancedFilterItem } from '@/components/shared/AdvancedFilter'
import { useCallback } from 'react'

export default function usePropertyList(advancedFilters: any[] = []) {
    const dispatch = useAppDispatch()
    const {
        tableData,
        filterData,
        setTableData,
        selectedProperties,
        setSelectedProperty,
        setSelectAllProperty,
        setFilterData,
    } = usePropertyListStore((state) => state)

    const {
        data: propertiesData,
        count: totalRecords,
        loading,
    } = useAppSelector((state) => state.property.property_list)

    const isLoading = loading === ILoadState.pending

    const fetchData = async () => {
        dispatch(
            fetchMultiplePropertiesWithArgsAsync({
                page: tableData.pageIndex ?? 1,
                rowsPerPage: tableData.pageSize ?? 10,
                ...(tableData.query
                    ? {
                        searchValue: tableData.query,
                        columns: ['property_details_name', 'slug', 'id'],
                    }
                    : {}),
                ...(tableData.sort?.key
                    ? {
                        sortBy: tableData.sort.key,
                        sortOrder: tableData.sort.order || 'asc',
                    }
                    : {}),
                ...(advancedFilters.length > 0
                    ? {
                        advanceFilter: JSON.stringify(advancedFilters),
                    }
                    : {}),
            }),
        )
    }

    const handleSetTableData = (data: TableQueries) => {
        setTableData(data)
        if (selectedProperties.length > 0) {
            setSelectAllProperty([])
        }
    }

    return {
        propertyList: propertiesData || [],
        propertyListTotal: totalRecords || 0,
        isLoading,
        tableData,
        filterData,
        fetchData,
        setTableData: handleSetTableData,
        selectedProperties,
        setSelectedProperty,
        setSelectAllProperty,
        setFilterData,
    }
}

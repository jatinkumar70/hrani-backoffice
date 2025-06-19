import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'

export const initialTableData: TableQueries = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        order: '',
        key: '',
    },
}

export const initialFilterData = {
    city: '',
    area: '',
}

export type Property = {
    id: string;
    property_details_name: string;
    property_details_uuid: string;
    property_images: any[];
    property_city: string;
    area: string;
    slug: string;
}

export type PropertyListState = {
    tableData: TableQueries
    filterData: typeof initialFilterData
    selectedProperties: Partial<Property>[]
}

type PropertyListAction = {
    setFilterData: (payload: typeof initialFilterData) => void
    setTableData: (payload: TableQueries) => void
    setSelectedProperty: (checked: boolean, property: Property) => void
    setSelectAllProperty: (properties: Property[]) => void
}

const initialState: PropertyListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedProperties: [],
}

export const usePropertyListStore = create<
    PropertyListState & PropertyListAction
>((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
    setSelectedProperty: (checked, row) =>
        set((state) => {
            const prevData = state.selectedProperties
            if (checked) {
                return { selectedProperties: [...prevData, ...[row]] }
            } else {
                if (prevData.some((prevProperty) => row.id === prevProperty.id)) {
                    return {
                        selectedProperties: prevData.filter(
                            (prevProperty) => prevProperty.id !== row.id,
                        ),
                    }
                }
                return { selectedProperties: prevData }
            }
        }),
    setSelectAllProperty: (row) => set(() => ({ selectedProperties: row })),
})) 
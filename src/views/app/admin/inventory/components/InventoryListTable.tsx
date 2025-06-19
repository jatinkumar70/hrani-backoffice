import { Container, DataTable } from '@/components/shared'
import { DatePicker, Select } from '@/components/ui'
import dayjs from 'dayjs'
import { debounce } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { InventoryItem, Property } from '../types'
import { ILoadState, useAppDispatch, useAppSelector } from '@/redux'
import {
    fetchInventoryAsync,
    fetchMultiplePropertiesWithArgsAsync,
    IProperty,
} from '@/redux/child-reducers/property'
import { TableQueries } from '@/@types/common'
import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'

const InventoryListTable = () => {
    const dispatch = useAppDispatch()

    const {
        data: propertiesData,
        count: totalProperties,
        loading: propertiesLoading,
    } = useAppSelector((state) => state.property.property_list)

    const [inventoryData, setInventoryData] = useState<InventoryItem[]>([])
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(
        null,
    )
    const [searchText, setSearchText] = useState('')
    const [fromDate, setFromDate] = useState<Date | null>(null)
    const [toDate, setToDate] = useState<Date | null>(null)
    const [tableData, setTableData] = useState<TableQueries>({
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: {
            key: '',
            order: '',
        },
    })
    const [inventoryLoading, setInventoryLoading] = useState(false)

    const isLoading = propertiesLoading === ILoadState.pending

    //  const columns = useMemo(
    //     () => [
    //         {
    //             header: 'Name',
    //             accessorKey: 'name',
    //         },
    //         {
    //             header: 'Quantity',
    //             accessorKey: 'quantity',
    //         },
    //         {
    //             header: 'Last Updated',
    //             accessorKey: 'last_updated',
    //             cell: ({ row }) => dayjs(row.original.last_updated).format('DD/MM/YYYY HH:mm')
    //         },
    //         {
    //             header: 'Status',
    //             accessorKey: 'status',
    //             cell: ({ row }) => (
    //                 <span className={`capitalize ${row.original.status === 'active' ? 'text-emerald-500' : 'text-red-500'}`}>
    //                     {row.original.status}
    //                 </span>
    //             )
    //         }
    //     ],
    //     []
    // )

    const columns = useMemo<ColumnDef<InventoryItem>[]>(
        () => [
            {
                header: 'Room Type',
                accessorKey: 'room_types_name',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span className="font-bold heading-text">
                            {row.room_types_name || '--'}
                        </span>
                    )
                },
            },
            {
                header: 'Date',
                accessorKey: 'calendar_date',
                cell: (props) => (
                    <div className="flex flex-col">
                        <span className="font-bold heading-text">
                            {moment(props.row.original.calendar_date).format(
                                'MMMM D, YYYY',
                            )}
                        </span>
                        <small>
                            {moment(props.row.original.calendar_date).format(
                                'hh:mm A',
                            )}
                        </small>
                    </div>
                ),
            },
            {
                header: 'Available Rooms',
                accessorKey: 'available_room',
            },
            {
                header: 'Refundable Price',
                accessorKey: 'refundable_price',
                cell: ({ row }: { row: { original: InventoryItem } }) =>
                    `${row.original.refundable_price}`,
            },
            {
                header: 'Non-Refundable Price',
                accessorKey: 'non_refundable_price',
                cell: ({ row }: { row: { original: InventoryItem } }) =>
                    `${row.original.non_refundable_price}`,
            },
        ],
        [],
    )

    const fetchProperties = useMemo(
        () =>
            debounce((query: string) => {
                dispatch(
                    fetchMultiplePropertiesWithArgsAsync({
                        page: tableData?.pageIndex || 1,
                        rowsPerPage: tableData?.pageSize || 10,
                        ...(query
                            ? {
                                  searchValue: query,
                                  columns: [
                                      'property_details_name',
                                      'slug',
                                      'id',
                                  ],
                              }
                            : {}),
                    }),
                )
            }, 500),
        [dispatch, tableData.pageIndex, tableData.pageSize],
    )

    const fetchInventory = async () => {
        if (!selectedProperty) {
            setInventoryData([])
            return
        }

        if ((fromDate && !toDate) || (!fromDate && toDate)) {
            return
        }

        setInventoryLoading(true)
        try {
            const result = await dispatch(
                fetchInventoryAsync({
                    property_details_uuid: selectedProperty.property_uuid,
                    from_date: fromDate
                        ? dayjs(fromDate).format('YYYY-MM-DD')
                        : null,
                    to_date: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
                }),
            ).unwrap()

            // Transform the nested object into a flat array
            const transformedData = []
            for (const date in result.data) {
                if (Array.isArray(result.data[date])) {
                    transformedData.push(
                        ...result.data[date].map((item) => ({
                            ...item,
                            calendar_date: date, // Ensure date is properly set
                        })),
                    )
                }
            }

            setInventoryData(transformedData)
        } catch (error) {
            console.error('Error fetching inventory:', error)
            setInventoryData([])
        } finally {
            setInventoryLoading(false)
        }
    }

    useEffect(() => {
        fetchProperties(searchText)
        return () => fetchProperties.cancel()
    }, [searchText, fetchProperties])

    useEffect(() => {
        fetchInventory()
    }, [selectedProperty, fromDate, toDate])

    const handleTableChange = (data: TableQueries) => {
        setTableData(data)
        dispatch(
            fetchMultiplePropertiesWithArgsAsync({
                page: data.pageIndex || 1,
                rowsPerPage: data.pageSize || 10,
                ...(data.query
                    ? {
                          searchValue: data.query,
                          columns: ['property_details_name', 'slug', 'id'],
                      }
                    : {}),
                ...(data.sort?.key
                    ? {
                          sortBy: data.sort.key,
                          sortOrder: data.sort.order || 'asc',
                      }
                    : {}),
            }),
        )
    }

    const propertyOptions = useMemo(() => {
        return (
            propertiesData?.map((prop: IProperty) => ({
                value: prop.property_details_uuid,
                label: prop.property_details_name || '',
            })) || []
        )
    }, [propertiesData])

    const selectedPropertyValue = useMemo(() => {
        if (!selectedProperty) return null
        return {
            value: selectedProperty.property_uuid,
            label: selectedProperty.property_name || '',
        }
    }, [selectedProperty])

    return (
        <Container>
            <div className="flex flex-col md:flex-row gap-3 mb-4">
                <Select
                    className="w-full"
                    placeholder="Search Property"
                    isLoading={isLoading}
                    options={propertyOptions}
                    value={selectedPropertyValue}
                    onInputChange={(value) => setSearchText(value)}
                    onChange={(option) => {
                        if (option) {
                            const property = propertiesData?.find(
                                (p) => p.property_details_uuid === option.value,
                            )
                            if (property) {
                                setSelectedProperty({
                                    property_uuid:
                                        property.property_details_uuid,
                                    property_name:
                                        property.property_details_name || '',
                                })
                            }
                        } else {
                            setSelectedProperty(null)
                            setInventoryData([])
                        }
                    }}
                />
                <DatePicker
                    placeholder="From Date"
                    value={fromDate}
                    onChange={(date) => {
                        setFromDate(date)
                        if (
                            date &&
                            toDate &&
                            dayjs(date).isAfter(dayjs(toDate))
                        ) {
                            setToDate(null)
                        }
                    }}
                />
                <DatePicker
                    placeholder="To Date"
                    value={toDate}
                    onChange={(date) => {
                        if (
                            date &&
                            fromDate &&
                            dayjs(date).isBefore(dayjs(fromDate))
                        ) {
                            return // Prevent setting toDate if it's before fromDate
                        }
                        setToDate(date)
                    }}
                    minDate={fromDate ? new Date(fromDate) : undefined}
                />
            </div>

            {((fromDate && !toDate) || (!fromDate && toDate)) && (
                <div className="mb-4 text-red-500">
                    Please select both From and To dates or leave both empty
                </div>
            )}

            <DataTable
                columns={columns}
                data={inventoryData}
                loading={isLoading || inventoryLoading}
                pagingData={{
                    total: inventoryData.length,
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={(page) =>
                    handleTableChange({ ...tableData, pageIndex: page })
                }
                onSelectChange={(pageSize) =>
                    handleTableChange({ ...tableData, pageSize })
                }
                onSort={(sort) => handleTableChange({ ...tableData, sort })}
            />
        </Container>
    )
}

export default InventoryListTable

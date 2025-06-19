import { Button, DatePicker, Dialog, Select } from '@/components/ui'
import React, { useState } from 'react'
import { Property } from '../types'

const InventoryListTableTools = () => {
    const [properties, setProperties] = useState<Property[]>([])
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(
        null,
    )
    const [searchText, setSearchText] = useState('')
    const [fromDate, setFromDate] = useState<Date | null>(null)
    const [toDate, setToDate] = useState<Date | null>(null)
    const [pagination, setPagination] = useState({
        pageIndex: 1,
        pageSize: 10,
        total: 0,
    })

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <Select
                className="w-full"
                placeholder="Search Property"
                options={properties.map((prop) => ({
                    value: prop.property_uuid,
                    label: prop.property_name,
                }))}
                value={
                    selectedProperty
                        ? {
                              value: selectedProperty.property_uuid,
                              label: selectedProperty.property_name,
                          }
                        : null
                }
                onInputChange={(value) => setSearchText(value)}
                onChange={(option) => {
                    if (option) {
                        setSelectedProperty({
                            property_uuid: option.value,
                            property_name: option.label,
                        })
                    } else {
                        setSelectedProperty(null)
                    }
                }}
            />
            <DatePicker
                placeholder="From Date"
                value={fromDate}
                onChange={setFromDate}
            />
            <DatePicker
                placeholder="To Date"
                value={toDate}
                onChange={setToDate}
            />
        </div>
    )
}

export default InventoryListTableTools

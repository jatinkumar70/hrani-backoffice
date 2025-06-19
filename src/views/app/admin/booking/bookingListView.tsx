/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useCallback, useEffect } from 'react'
import DataTable from '@/components/shared/DataTable'
import type { ColumnDef, OnSortParam } from '@/components/shared/DataTable'
import type { TableQueries } from '@/@types/common'
import cloneDeep from 'lodash/cloneDeep'
import { useNavigate } from 'react-router'
import Tag from '@/components/ui/Tag'
import dayjs from 'dayjs'
import { TbEye, TbPencil } from 'react-icons/tb'
import {
    BedSingle,
    Calendar,
    Clock,
    CreditCard,
    Home,
    Mail,
    MapPin,
    Package,
    Phone,
    User,
    Users,
    CheckCircle,
    AlertCircle,
    XCircle,
    HelpCircle,
    BarChart3,
} from 'lucide-react'
import Tooltip from '@/components/ui/Tooltip'
import Card from '@/components/ui/Card'
import Drawer from '@/components/ui/Drawer'
import axios_base_api from '@/api/axios-base-api'
import Pagination from '@/components/ui/Pagination'

import moment from 'moment'
import ListActionTools from '@/components/filters/ListActionTools'
import {
    statusOptions,
    columnOptions,
    operatorOptions,
    logicalOperatorOptions,
    quickSearchFields,
} from './components/Constants'

// Types
interface Booking {
    booking_uuid: string
    order_id: string
    status: string
    property_details_name: string
    user_name: string
    package: string
    from_date: string
    to_date: string
    is_refundable: string | null
    payment_status: string | null
    mobile: string
    bed_id: string
    total_price: number
    currency: string
    area: string
    booking_source: string
    beds_id: string
    total_nights: string
    create_ts: string
    insert_ts: string
    email: string
    no_of_guests: string
    price_breakup?: {
        tax?: number
        commission?: number
        total_price: number
        after_discount?: {
            vat: number
        }
    }
    property_details?: {
        area: string
    }
    ota_booking_reference?: string
    contract_id?: string
    contract_name?: string
    contract_type?: string
    contract_start_date?: string
    contract_end_date?: string
    bnbme_mgmt_fee?: number
    mgmt_fee?: number
    conmpset?: string
    invoice_id?: string
    bnbme_invoice?: string
    payment_method?: string
    gross_owner_payout?: number
    gross_room_rental_price?: number
    net_room_rental?: number
    gross_revenue?: number
    ota_fees?: number
    direct_booking_commission?: number
    service_charge?: number
    cleaning_fee?: number
    awd?: number
    td?: number
    vat?: number
    owner_recharge?: number
    management_fee?: number
}

interface StatusCount {
    status: string
    count: number
}

type BookingStatus = 'inquiry' | 'new' | 'confirmed'

const BookingListView = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [bookings, setBookings] = useState<Booking[]>([])
    const [totalBookings, setTotalBookings] = useState(0)
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [tableData, setTableData] = useState<TableQueries>({
        pageIndex: 1,
        pageSize: 50,
        sort: { order: 'desc' as const, key: 'order_id' },
        query: '',
    })
    const [advancedFilters, setAdvancedFilters] = useState<any[]>([])
    const [isFilterActive, setIsFilterActive] = useState(false)
    const [csvData, setCsvData] = useState<any[]>([])
    const [activeFilters, setActiveFilters] = useState<any[]>([])

    // Calculate status counts from bookings data
    const statusCounts = useMemo(() => {
        const counts: { [key: string]: number } = {}

        bookings.forEach((booking) => {
            const status = booking.status || 'unknown'
            counts[status] = (counts[status] || 0) + 1
        })

        return Object.entries(counts).map(([status, count]) => ({
            status,
            count,
        }))
    }, [bookings])

    // Fetch bookings data
    const fetchBookings = useCallback(async () => {
        setIsLoading(true)
        try {
            const params: Record<string, any> = {
                pageNo: tableData.pageIndex,
                itemPerPage: tableData.pageSize,
                pageLimit: tableData.pageSize,
            }

            if (tableData.query) {
                params.value = tableData.query
                params.columns = [
                    'status',
                    'user_name',
                    'property_details_name',
                    'is_refundable',
                    'from_date',
                    'to_date',
                    'payment_status',
                    'mobile',
                    'beds_id',
                    'property_details',
                    'no_of_guests',
                    'total_price',
                    'booking_source',
                    'total_nights',
                ]
            }

            if (advancedFilters.length > 0) {
                const formattedFilters = advancedFilters.map((filter) => ({
                    column: [filter.column],
                    operator: filter.operator,
                    value: filter.value,
                    logicalOperator: filter.logicalOperator,
                }))
                params.advanceFilter = JSON.stringify(formattedFilters)
            }

            const response = await axios_base_api.get(
                '/inventory/get-booking',
                { params },
            )
            const sortedBookings = sortByInsertTsDesc(response.data.data)
            setBookings(sortedBookings)
            setTotalBookings(response.data.totalRecords)
        } catch (error) {
            console.error('Error fetching bookings:', error)
        } finally {
            setIsLoading(false)
        }
    }, [tableData, advancedFilters])

    // Fetch all bookings for CSV
    const fetchAllBookings = useCallback(async () => {
        try {
            // First get the total count
            const countParams: Record<string, any> = {
                pageNo: 1,
                itemPerPage: 1,
                pageLimit: 1,
            }

            if (tableData.query) {
                countParams.value = tableData.query
                countParams.columns = [
                    'status',
                    'user_name',
                    'property_details_name',
                    'is_refundable',
                    'from_date',
                    'to_date',
                    'payment_status',
                    'mobile',
                    'beds_id',
                    'property_details',
                    'no_of_guests',
                    'total_price',
                    'booking_source',
                    'total_nights',
                ]
            }

            if (advancedFilters.length > 0) {
                const formattedFilters = advancedFilters.map((filter) => ({
                    column: [filter.column],
                    operator: filter.operator,
                    value: filter.value,
                    logicalOperator: filter.logicalOperator,
                }))
                countParams.advanceFilter = JSON.stringify(formattedFilters)
            }

            const countResponse = await axios_base_api.get(
                '/inventory/get-booking',
                { params: countParams },
            )
            const totalRecords = countResponse.data.totalRecords

            // Now fetch all records using the total count as limit
            const params: Record<string, any> = {
                pageNo: 1,
                itemPerPage: totalRecords,
                pageLimit: totalRecords,
            }

            if (tableData.query) {
                params.value = tableData.query
                params.columns = [
                    'status',
                    'user_name',
                    'property_details_name',
                    'is_refundable',
                    'from_date',
                    'to_date',
                    'payment_status',
                    'mobile',
                    'beds_id',
                    'property_details',
                    'no_of_guests',
                    'total_price',
                    'booking_source',
                    'total_nights',
                ]
            }

            if (advancedFilters.length > 0) {
                const formattedFilters = advancedFilters.map((filter) => ({
                    column: [filter.column],
                    operator: filter.operator,
                    value: filter.value,
                    logicalOperator: filter.logicalOperator,
                }))
                params.advanceFilter = JSON.stringify(formattedFilters)
            }

            const response = await axios_base_api.get(
                '/inventory/get-booking',
                { params },
            )
            const sortedBookings = sortByInsertTsDesc(response.data.data)

            // Prepare CSV data
            const csvData = sortedBookings.map((booking) => ({
                'Order ID': booking.order_id || '-',
                Area: booking.property_details?.area || '-',
                'Property Name': booking.property_details_name || '-',
                'Booking Status': booking.status || '-',
                'Payment Status': booking.payment_status || '-',
                'Booking Source': booking.booking_source || '-',
                'Beds ID': booking.beds_id || '-',
                'Check-in Date': booking.from_date
                    ? moment(booking.from_date).format('MMMM D, YYYY hh:mm A')
                    : '-',
                'Check-out Date': booking.to_date
                    ? moment(booking.to_date).format('MMMM D, YYYY hh:mm A')
                    : '-',
                'Total Nights (LOS)': booking.total_nights || '-',
                'Booking Date': booking.create_ts
                    ? moment(booking.create_ts).format('MMMM D, YYYY hh:mm A')
                    : '-',
                'Guest Name': booking.user_name || '-',
                'Contact Number': booking.mobile || '-',
                'Email Address': booking.email || '-',
                'Number of Guests': booking.no_of_guests || '-',
                'Payment Method': booking.payment_method || '-',
                'Refundable Status':
                    booking.is_refundable === null
                        ? 'No'
                        : booking.is_refundable || '-',
                'Total Amount': booking.total_price
                    ? `${booking.currency} ${booking.total_price}`
                    : '-',
                Package: `${booking.package}` || '-',
                'Gross Revenue': booking.gross_revenue
                    ? `${booking.currency} ${booking.gross_revenue}`
                    : '-',
                'OTA Fees': booking.ota_fees
                    ? `${booking.currency} ${booking.ota_fees}`
                    : '-',
                'Direct Booking Commission': booking.direct_booking_commission
                    ? `${booking.currency} ${booking.direct_booking_commission}`
                    : '-',
                'Service Charge': booking.service_charge
                    ? `${booking.currency} ${booking.service_charge}`
                    : '-',
                'Cleaning Fee': booking.cleaning_fee
                    ? `${booking.currency} ${booking.cleaning_fee}`
                    : '-',
                AWD: booking.awd ? `${booking.currency} ${booking.awd}` : '-',
                TD: booking.td ? `${booking.currency} ${booking.td}` : '-',
                VAT: booking.vat ? `${booking.currency} ${booking.vat}` : '-',
                'Owner Recharge': booking.owner_recharge
                    ? `${booking.currency} ${booking.owner_recharge}`
                    : '-',
                'Management Fee': booking.management_fee
                    ? `${booking.currency} ${booking.management_fee}`
                    : '-',
                'OTA Reference': booking.ota_booking_reference || '-',
                'Contract ID': booking.contract_id || '-',
                'Contract Name': booking.contract_name || '-',
                'Contract Period': booking.contract_start_date || '-',
                'BNBME Mgmt Fee': booking.bnbme_mgmt_fee || '-',
                Conmpset: booking.conmpset || '-',
                'Invoice ID': booking.invoice_id || '-',
                'BNBME Invoice': booking.bnbme_invoice || '-',
                'Gross Owner Payout': booking.gross_owner_payout || '-',
                'Gross Room Rental': booking.gross_room_rental_price || '-',
                'Net Room Rental': booking.net_room_rental || '-',
            }))
            setCsvData(csvData)
        } catch (error) {
            console.error('Error fetching bookings for CSV:', error)
        }
    }, [tableData.query, advancedFilters])

    // Fetch data when dependencies change
    useEffect(() => {
        fetchBookings()
        fetchAllBookings()
    }, [fetchBookings, fetchAllBookings])

    // Table columns configuration
    const columns: ColumnDef<Booking>[] = useMemo(
        () => [
            {
                header: 'Action',
                id: 'action',
                cell: (props) => (
                    <div className="flex justify-end text-lg gap-1 font-bold heading-text">
                        <Tooltip wrapperClass="flex" title="View">
                            <span
                                className={`cursor-pointer p-2`}
                                onClick={() => handleView(props.row.original)}
                            >
                                <TbEye />
                            </span>
                        </Tooltip>
                        <Tooltip wrapperClass="flex" title="Edit">
                            <span
                                className={`cursor-pointer p-2`}
                                onClick={() =>
                                    handleRowClick(props.row.original)
                                }
                            >
                                <TbPencil />
                            </span>
                        </Tooltip>
                    </div>
                ),
            },
            {
                header: 'Area',
                accessorKey: 'property_details.area',
                cell: (props) => (
                    <span className="font-bold heading-text">
                        {props.row.original.property_details?.area || '-'}
                    </span>
                ),
            },
            {
                header: 'Property',
                accessorKey: 'property_details_name',
                cell: (props) => (
                    <div
                        className="cursor-pointer"
                        onClick={() => handleRowClick(props.row.original)}
                    >
                        <span className="font-bold heading-text">
                            {props.row.original.property_details_name || '-'}
                        </span>
                    </div>
                ),
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const status =
                        props.row.original.status.toLowerCase() as BookingStatus
                    return (
                        <div
                            className="cursor-pointer"
                            onClick={() => handleRowClick(props.row.original)}
                        >
                            <Tag
                                className={
                                    getStatusColor(props.row.original.status) ||
                                    'bg-gray-100 text-black-800'
                                }
                            >
                                {props.row.original.status
                                    .charAt(0)
                                    .toUpperCase() +
                                    props.row.original.status.slice(1)}
                            </Tag>
                        </div>
                    )
                },
            },
            {
                header: 'Payment Status',
                accessorKey: 'payment_status',
                cell: (props) => {
                    const status =
                        props.row.original.payment_status || 'pending'
                    return (
                        <span className={`capitalize font-semibold`}>
                            {props.row.original.payment_status || '-'}
                        </span>
                    )
                },
            },
            {
                header: 'Booking Source',
                accessorKey: 'booking_source',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.booking_source || '-'}
                    </span>
                ),
            },
            {
                header: 'Beds ID',
                accessorKey: 'beds_id',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.beds_id || '-'}
                    </span>
                ),
            },
            {
                header: 'Check in',
                accessorKey: 'from_date',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex min-w-[70px] flex-col">
                            <span className="font-bold heading-text">
                                {moment(row.from_date).format('MMMM, D YYYY')}
                            </span>
                            <small>
                                {moment(row.from_date).format('hh:mm A')}
                            </small>
                        </div>
                    )
                },
            },
            {
                header: 'Check out',
                accessorKey: 'to_date',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex min-w-[70px] flex-col">
                            <span className="font-bold heading-text">
                                {moment(row.to_date).format('MMMM, D YYYY')}
                            </span>
                            <small>
                                {moment(row.to_date).format('hh:mm A')}
                            </small>
                        </div>
                    )
                },
            },
            {
                header: 'LOS',
                accessorKey: 'total_nights',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.total_nights || '-'}
                    </span>
                ),
            },
            {
                header: 'Booking Date',
                accessorKey: 'create_ts',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex flex-col">
                            <span className="font-bold heading-text">
                                {moment(row.create_ts).format('MMMM, D YYYY')}
                            </span>
                            <small>
                                {moment(row.create_ts).format('hh:mm A')}
                            </small>
                        </div>
                    )
                },
            },
            {
                header: 'Name',
                accessorKey: 'user_name',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.user_name || '-'}
                    </span>
                ),
            },
            {
                header: 'Mobile',
                accessorKey: 'mobile',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.mobile || '-'}
                    </span>
                ),
            },
            {
                header: 'Email',
                accessorKey: 'email',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.email || '-'}
                    </span>
                ),
            },
            {
                header: 'No of guests',
                accessorKey: 'no_of_guests',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.no_of_guests || '-'}
                    </span>
                ),
            },
            {
                header: 'Gross Room Rental',
                accessorKey: 'total_price',
                cell: (props) => {
                    const netRoomRental = props.row.original.total_price || 0
                    const vat =
                        props.row.original.price_breakup?.after_discount?.vat ||
                        props.row.original.price_breakup?.tax ||
                        0
                    const grossRoomRental = netRoomRental - vat

                    return (
                        <div className="flex flex-col">
                            <span className="font-semibold">
                                {grossRoomRental.toLocaleString()}
                            </span>
                        </div>
                    )
                },
            },
            {
                header: 'VAT',
                accessorKey: 'price_breakup.tax',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.price_breakup?.tax === 0
                            ? '0'
                            : props.row.original.price_breakup?.after_discount?.vat.toLocaleString()
                                ? `${props.row.original.price_breakup?.after_discount?.vat.toLocaleString()}`
                                : '-'}
                    </span>
                ),
            },
            {
                header: 'Net Room Rental',
                accessorKey: 'total_price',
                cell: (props) => {
                    return (
                        <span className="font-semibold">
                            {props.row.original.total_price.toLocaleString() ||
                                '-'}
                        </span>
                    )
                },
            },
            {
                header: 'Package',
                accessorKey: 'is_refundable',
                cell: (props) => {
                    const refundableStatus = props.row.original.is_refundable
                    return (
                        <span className={`capitalize font-semibold`}>
                            {refundableStatus === null
                                ? 'Non-Refundable'
                                : refundableStatus || '-'}
                        </span>
                    )
                },
            },
            {
                header: 'OTA Reference',
                accessorKey: 'ota_booking_reference',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.ota_booking_reference || '-'}
                    </span>
                ),
            },
            {
                header: 'Contract ID',
                accessorKey: 'contract_id',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.contract_id || '-'}
                    </span>
                ),
            },
            {
                header: 'Contract Name',
                accessorKey: 'contract_name',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.contract_name || '-'}
                    </span>
                ),
            },
            {
                header: 'Contract Type',
                accessorKey: 'contract_type',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.contract_type || '-'}
                    </span>
                ),
            },
            {
                header: 'Contract Period',
                accessorKey: 'contract_start_date',
                cell: (props) => {
                    const startDate = props.row.original.contract_start_date
                    const endDate = props.row.original.contract_end_date
                    return (
                        <span className="font-semibold">
                            {startDate && endDate
                                ? `${moment(startDate).format('DD MMM YYYY')} - ${moment(endDate).format('DD MMM YYYY')}`
                                : '-'}
                        </span>
                    )
                },
            },
            {
                header: 'BNBME Mgmt Fee',
                accessorKey: 'bnbme_mgmt_fee',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.bnbme_mgmt_fee
                            ? `${props.row.original.currency || ''} ${props.row.original.bnbme_mgmt_fee.toLocaleString()}`
                            : '-'}
                    </span>
                ),
            },
            {
                header: 'Mgmt Fee',
                accessorKey: 'mgmt_fee',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.mgmt_fee
                            ? `${props.row.original.currency || ''} ${props.row.original.mgmt_fee.toLocaleString()}`
                            : '-'}
                    </span>
                ),
            },
            {
                header: 'Conmpset',
                accessorKey: 'conmpset',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.conmpset || '-'}
                    </span>
                ),
            },
            {
                header: 'Invoice ID',
                accessorKey: 'invoice_id',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.invoice_id || '-'}
                    </span>
                ),
            },
            {
                header: 'BNBME Invoice',
                accessorKey: 'bnbme_invoice',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.bnbme_invoice || '-'}
                    </span>
                ),
            },
            {
                header: 'Payment Method',
                accessorKey: 'payment_method',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.payment_method || '-'}
                    </span>
                ),
            },
            {
                header: 'Gross Owner Payout',
                accessorKey: 'gross_owner_payout',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.gross_owner_payout
                            ? `${props.row.original.currency || ''} ${props.row.original.gross_owner_payout.toLocaleString()}`
                            : '-'}
                    </span>
                ),
            },
            {
                header: 'Gross Room Rental',
                accessorKey: 'gross_room_rental_price',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.gross_room_rental_price
                            ? `${props.row.original.currency || ''} ${props.row.original.gross_room_rental_price.toLocaleString()}`
                            : '-'}
                    </span>
                ),
            },
            {
                header: 'Net Room Rental',
                accessorKey: 'net_room_rental',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.net_room_rental
                            ? `${props.row.original.currency || ''} ${props.row.original.net_room_rental.toLocaleString()}`
                            : '-'}
                    </span>
                ),
            },
            {
                header: 'Gross Revenue',
                accessorKey: 'gross_revenue',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.gross_revenue
                            ? `${props.row.original.currency || ''} ${props.row.original.gross_revenue.toLocaleString()}`
                            : '-'}
                    </span>
                ),
            },
            {
                header: 'OTA Fees',
                accessorKey: 'ota_fees',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.ota_fees
                            ? `${props.row.original.currency || ''} ${props.row.original.ota_fees.toLocaleString()}`
                            : '-'}
                    </span>
                ),
            },
            {
                header: 'Direct Booking Commission',
                accessorKey: 'direct_booking_commission',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.direct_booking_commission
                            ? `${props.row.original.currency || ''} ${props.row.original.direct_booking_commission.toLocaleString()}`
                            : '-'}
                    </span>
                ),
            },
            {
                header: 'Service Charge',
                accessorKey: 'service_charge',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.service_charge
                            ? `${props.row.original.currency || ''} ${props.row.original.service_charge.toLocaleString()}`
                            : '-'}
                    </span>
                ),
            },
            {
                header: 'Cleaning Fee',
                accessorKey: 'cleaning_fee',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.cleaning_fee
                            ? `${props.row.original.currency || ''} ${props.row.original.cleaning_fee.toLocaleString()}`
                            : '-'}
                    </span>
                ),
            },
            {
                header: 'AWD',
                accessorKey: 'awd',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.awd
                            ? `${props.row.original.currency || ''} ${props.row.original.awd.toLocaleString()}`
                            : '-'}
                    </span>
                ),
            },
            {
                header: 'TD',
                accessorKey: 'td',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.td
                            ? `${props.row.original.currency || ''} ${props.row.original.td.toLocaleString()}`
                            : '-'}
                    </span>
                ),
            },
            {
                header: 'VAT',
                accessorKey: 'vat',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.vat
                            ? `${props.row.original.currency || ''} ${props.row.original.vat.toLocaleString()}`
                            : '-'}
                    </span>
                ),
            },
            {
                header: 'Owner Recharge',
                accessorKey: 'owner_recharge',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.owner_recharge
                            ? `${props.row.original.currency || ''} ${props.row.original.owner_recharge.toLocaleString()}`
                            : '-'}
                    </span>
                ),
            },
            {
                header: 'Management Fee',
                accessorKey: 'management_fee',
                cell: (props) => (
                    <span className="font-semibold">
                        {props.row.original.management_fee
                            ? `${props.row.original.currency || ''} ${props.row.original.management_fee.toLocaleString()}`
                            : '-'}
                    </span>
                ),
            },
        ],
        [],
    )

    // Helper functions

    const handleAdvancedSearch = (filters: any[]) => {
        setActiveFilters(filters)
        setAdvancedFilters(filters)
        setIsFilterActive(filters.length > 0)

        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = 1
        setTableData(newTableData)
    }

    const handleQuickSearch = (searchValues: Record<string, string>) => {
        const dateFilters: {
            column: string
            operator: string
            value: string
            logicalOperator: string
        }[] = []

        // Handle other fields normally
        const otherFilters = Object.entries(searchValues)
            .filter(
                ([field, value]) =>
                    value.trim() !== '' &&
                    field !== 'from_date' &&
                    field !== 'to_date',
            )
            .map(([column, value]) => ({
                column: [column],
                operator: 'CONTAINS',
                value,
                logicalOperator: 'AND',
            }))

        const activeFilters = [...dateFilters, ...otherFilters]

        setActiveFilters(activeFilters)

        setAdvancedFilters(activeFilters)
        setIsFilterActive(activeFilters.length > 0)

        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = 1
        setTableData(newTableData)
    }

    const handleResetFilters = () => {
        setAdvancedFilters([])
        setIsFilterActive(false)

        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = 1
        setTableData(newTableData)
    }

    const handleView = (booking: Booking) => {
        setSelectedBooking(booking)
        setIsDrawerOpen(true)
    }

    const handleDrawerClose = () => {
        setIsDrawerOpen(false)
        setSelectedBooking(null)
    }

    const handleRowClick = (booking: Booking) => {
        navigate(`/app/admin/booking/${booking.booking_uuid}`)
    }

    const handlePaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        setTableData(newTableData)
    }

    const handleSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        setTableData(newTableData)
    }

    const handleSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        setTableData(newTableData)
    }

    const sortByInsertTsDesc = (data: Booking[]) => {
        return data.sort(
            (a, b) =>
                new Date(b.insert_ts).getTime() -
                new Date(a.insert_ts).getTime(),
        )
    }
    const formatPrice = (
        amount: number | null | undefined,
        currency = 'AED',
    ) => {
        if (amount === null || amount === undefined || isNaN(amount))
            return 'N/A'
        const formattedAmount = Number(amount).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        })
        return `${currency} ${formattedAmount}`
    }

    const getStatusColor = (status: string | null) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
            case 'success':
                return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
            case 'pending':
            case 'inquiry':
                return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'
            case 'cancelled':
                return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
            case 'completed':
                return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300'
            default:
                return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
        }
    }

    const getPaymentStatusColor = (status: string | null) => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
            case 'pending':
                return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'
            case 'failed':
                return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
            case 'refunded':
                return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300'
            default:
                return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
        }
    }

    // Status Dashboard Component
    const StatusDashboard = () => {
        const getStatusIcon = (status: string) => {
            switch (status.toLowerCase()) {
                case 'confirmed':
                    return <CheckCircle className="w-5 h-5 text-green-600" />
                case 'inquiry':
                    return <HelpCircle className="w-5 h-5 text-yellow-600" />
                case 'cancelled':
                    return <XCircle className="w-5 h-5 text-red-600" />
                case 'new':
                    return <AlertCircle className="w-5 h-5 text-blue-600" />
                default:
                    return <BarChart3 className="w-5 h-5 text-gray-600" />
            }
        }

        const getStatusColor = (status: string) => {
            switch (status.toLowerCase()) {
                case 'confirmed':
                    return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30'
                case 'inquiry':
                    return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                case 'cancelled':
                    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30'
                case 'new':
                    return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                default:
                    return 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
            }
        }

        const totalDisplayedCount = statusCounts.reduce(
            (sum, item) => sum + item.count,
            0,
        )

        if (isLoading) {
            return (
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Status Distribution
                        </h3>
                        <div className="animate-pulse">
                            <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-20"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-200 dark:bg-gray-700 rounded-md p-3 h-16"></div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }

        return (
            <div className="mb-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status Distribution
                    </h3>
                    <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {totalBookings?.toLocaleString()} Total
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {totalDisplayedCount.toLocaleString()} Displayed
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
                    {statusCounts.map((item) => (
                        <div
                            key={item.status}
                            className={`
                                ${getStatusColor(item.status)}
                                p-3 rounded-md border transition-all duration-200 
                                hover:shadow-sm cursor-pointer
                            `}
                            onClick={() => {
                                // Filter by status when clicked
                                const statusFilter = [{
                                    column: ['status'],
                                    operator: 'EQUAL',
                                    value: item.status,
                                    logicalOperator: 'AND',
                                }]
                                setAdvancedFilters(statusFilter)
                                setIsFilterActive(true)
                                const newTableData = cloneDeep(tableData)
                                newTableData.pageIndex = 1
                                setTableData(newTableData)
                            }}
                        >
                            <div className="flex items-center justify-between mb-1">
                                {getStatusIcon(item.status)}
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    {item.status}
                                </span>
                            </div>
                            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {item.count.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {totalDisplayedCount > 0
                                    ? ((item.count / totalDisplayedCount) * 100).toFixed(1)
                                    : 0}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <Card className="h-full p-4">
            <ListActionTools
                title="Bookings"
                advancedFilterConfig={{
                    //@ts-ignore
                    columnOptions,
                    //@ts-ignore
                    operatorOptions,
                    //@ts-ignore
                    logicalOperatorOptions,
                    selectOptions: {
                        //@ts-ignore
                        status: statusOptions,
                    },
                }}
                //@ts-ignore
                quickSearchFields={quickSearchFields}
                csvData={csvData}
                isFilterActive={isFilterActive}
                onAdvancedSearch={handleAdvancedSearch}
                onQuickSearch={handleQuickSearch}
                onResetFilters={handleResetFilters}
                activeFilters={activeFilters}
            />

            {/* Status Dashboard */}
            <StatusDashboard />

            <DataTable
                columns={columns}
                data={bookings}
                loading={isLoading}
                pagingData={{
                    total: totalBookings,
                    pageIndex: tableData.pageIndex as number,
                    pageSize: tableData.pageSize as number,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
            >
                <Pagination
                    pageSize={tableData.pageSize}
                    currentPage={tableData.pageIndex}
                    total={totalBookings}
                    displayTotal={true}
                    onChange={handlePaginationChange}
                />
            </DataTable>

            {/* Booking Details Drawer */}
            <Drawer
                title="Booking Details"
                isOpen={isDrawerOpen}
                onClose={handleDrawerClose}
                onRequestClose={handleDrawerClose}
                width={500}
            >
                {selectedBooking && (
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-gray-800 pb-4">
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    Booking Details
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                                    #{selectedBooking.order_id || '-'}
                                </p>
                            </div>
                            <div
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}
                            >
                                {selectedBooking.status || '-'}
                            </div>
                        </div>

                        {/* Guest Information */}
                        <div className="mb-6">
                            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
                                Guest Information
                            </h2>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <User className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Guest Name
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedBooking.user_name || '-'}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Contact Number
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedBooking.mobile || '-'}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Email
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedBooking.email || '-'}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Users className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            No of Guests
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedBooking.no_of_guests || '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Stay Details */}
                        <div className="mb-6">
                            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
                                Stay Details
                            </h2>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Home className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Property
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedBooking.property_details_name ||
                                            '-'}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Area
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedBooking.property_details
                                            ?.area || '-'}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <BedSingle className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Bed ID
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedBooking.beds_id || '-'}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Package className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Package Type
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedBooking.package || '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Reservation Period */}
                        <div className="mb-6">
                            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">
                                Reservation Period
                            </h2>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Check-in
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedBooking.from_date
                                            ? dayjs(
                                                selectedBooking.from_date,
                                            ).format('DD MMM YYYY')
                                            : '-'}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Check-out
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedBooking.to_date
                                            ? dayjs(
                                                selectedBooking.to_date,
                                            ).format('DD MMM YYYY')
                                            : '-'}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Duration
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {dayjs(selectedBooking.to_date).diff(
                                            dayjs(selectedBooking.from_date),
                                            'day',
                                        )}{' '}
                                        nights
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Financial Breakdown Information */}
                        <div className="mb-6">
                            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3 ">
                                Financial Breakdown
                            </h2>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Gross Revenue
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {formatPrice(
                                            selectedBooking.gross_revenue,
                                        ) || '-'}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            OTA Fees
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {formatPrice(
                                            selectedBooking.ota_fees,
                                        ) || '-'}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Direct Booking Commission
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {formatPrice(
                                            selectedBooking.direct_booking_commission,
                                        ) || '-'}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Service Charge
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {formatPrice(
                                            selectedBooking.service_charge,
                                        ) || '-'}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Cleaning Fee
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {formatPrice(
                                            selectedBooking.cleaning_fee,
                                        ) || '-'}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            AWD
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {formatPrice(selectedBooking.awd) ||
                                            '-'}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            TD
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {formatPrice(selectedBooking.td) || '-'}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            VAT
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {formatPrice(selectedBooking.vat) ||
                                            '-'}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Owner Recharge
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {formatPrice(
                                            selectedBooking.owner_recharge,
                                        ) || '-'}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Management Fee
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {formatPrice(
                                            selectedBooking.management_fee,
                                        ) || '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="mb-6">
                            <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3 ">
                                Payment Information
                            </h2>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Payment Status
                                        </p>
                                    </div>
                                    <div
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedBooking.payment_status)}`}
                                    >
                                        {selectedBooking.payment_status || '-'}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Package className="w-4 h-4 text-gray-400 mr-2" />
                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Package Type
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {selectedBooking.is_refundable === null
                                            ? 'Non-Refundable'
                                            : selectedBooking.is_refundable ||
                                            '-'}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        Total Amount
                                    </p>
                                    <p className="font-bold text-gray-900 dark:text-gray-100">
                                        {selectedBooking.currency || ''}{' '}
                                        {selectedBooking.total_price
                                            ? selectedBooking.total_price.toLocaleString()
                                            : '-'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Drawer>
        </Card>
    )
}

export default BookingListView
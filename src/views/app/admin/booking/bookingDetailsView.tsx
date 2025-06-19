"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios_base_api from "@/api/axios-base-api"
import dayjs from "dayjs"
import {
  Calendar,
  Clock,
  CreditCard,
  Home,
  MapPin,
  Package,
  Phone,
  User,
  FileText,
  Building,
  DollarSign,
  Mail,
  Users,
  ExternalLink,
  Receipt,
  Banknote,
} from "lucide-react"

interface BookingDetails {
  booking_uuid: string
  order_id: string
  property_details_name: string
  user_name: string
  status: string
  bed_id: string
  package: string
  from_date: string
  to_date: string
  is_refundable: string | null
  payment_status: string | null
  mobile: string
  total_price: number
  currency: string
  ota_booking_reference: string | null
  contract_id: string | null
  contract_name: string | null
  contract_start_date: string | null
  contract_end_date: string | null
  contract_type: string | null
  bnbme_mgmt_fee: number | null
  mgmt_fee: number | null
  conmpset: string | null
  booking_source: string | null
  invoice_id: string | null
  bnbme_invoice: string | null
  no_of_guests: number | null
  payment_method: string | null
  booking_date_time: string | null
  profile: string | null
  gross_room_rental_price: number | null
  net_room_rental: number | null
  gross_owner_payout: number | null
  email: string | null
  property_details?: {
    area: string
  }
  gross_revenue?: number | null
  ota_fees?: number | null
  direct_booking_commission?: number | null
  service_charge?: number | null
  cleaning_fee?: number | null
  awd?: number | null
  td?: number | null
  vat?: number | null
  owner_recharge?: number | null
  management_fee?: number | null
}

const BookingDetailsView = () => {
  const { booking_uuid } = useParams()
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState<BookingDetails | null>(null)

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setLoading(true)
      try {
        const response = await axios_base_api.get(
          `/inventory/get-booking?booking_uuid=${booking_uuid}&pageNo=1&itemPerPage=20`,
        )
        if (response.data && response.data.data && response.data.data.length > 0) {
          setBooking(response.data.data[0])
        }
      } catch (error) {
        console.error("Error fetching booking details:", error)
      } finally {
        setLoading(false)
      }
    }

    if (booking_uuid) {
      fetchBookingDetails()
    }
  }, [booking_uuid])

  const formatPrice = (amount: number | null | undefined, currency = "$") => {
    if (amount === null || amount === undefined || isNaN(amount)) return "N/A"
    const formattedAmount = Number(amount).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    return `${currency} ${formattedAmount}`
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "success":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
      case "pending":
      case "inquiry":
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300"
      case "cancelled":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300"
      case "completed":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300"
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
    }
  }

  const getPaymentStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
      case "pending":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
      case "failed":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800"
      case "refunded":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800"
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700"
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 h-full animate-pulse">
        <div className="p-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/3 mb-8"></div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 break-inside-avoid">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex justify-between">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 h-full">
        <div className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Booking Not Found</h3>
          <p className="text-gray-500 dark:text-gray-400">The booking details could not be loaded or do not exist.</p>
        </div>
      </div>
    )
  }

  const stayDuration = dayjs(booking.to_date).diff(dayjs(booking.from_date), "day")

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 h-full transition-all duration-300 hover:shadow-xl">
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Booking Details</h1>
            <p className="text-gray-500 dark:text-gray-400">Complete information about this reservation</p>
          </div>
          <div className="mt-6 lg:mt-0 flex flex-col items-start lg:items-end space-y-3">
            <div className="flex items-center bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">Order ID:</span>
              <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                #{booking.order_id || "N/A"}
              </span>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(booking.status)}`}>
              {booking.status || "Unknown"}
            </div>
          </div>
        </div>

        {/* Masonry Layout */}
        <div className="columns-1 md:columns-2 lg:columns-2 gap-6 space-y-6">
          {/* Guest Information */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Guest Information</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center py-3 px-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <User className="w-5 h-5 text-blue-500 mr-4" />
                  <div className="flex-1 flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Guest Name</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{booking.user_name || "N/A"}</span>
                  </div>
                </div>

                <div className="flex items-center py-3 px-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-500 mr-4" />
                  <div className="flex-1 flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Contact Number</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{booking.mobile || "N/A"}</span>
                  </div>
                </div>

                <div className="flex items-center py-3 px-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-500 mr-4" />
                  <div className="flex-1 flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {booking.email || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center py-3 px-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-500 mr-4" />
                  <div className="flex-1 flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Number of Guests</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {booking.no_of_guests || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reservation Period */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Reservation Period</h2>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="w-5 h-5 text-purple-500 mr-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Check-in</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                    {booking.from_date ? dayjs(booking.from_date).format("DD MMM YYYY") : "N/A"}
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="w-5 h-5 text-purple-500 mr-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Check-out</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                    {booking.to_date ? dayjs(booking.to_date).format("DD MMM YYYY") : "N/A"}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-purple-200 dark:border-purple-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-purple-500 mr-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Duration</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {stayDuration > 0 ? `${stayDuration} ${stayDuration === 1 ? "night" : "nights"}` : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Property Information */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Property Details</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start py-3 px-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <Home className="w-5 h-5 text-green-500 mr-4 mt-0.5" />
                  <div className="flex-1 flex justify-between items-start">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Property Sku</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100 text-right max-w-[60%]">
                      {booking.property_details_name || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center py-3 px-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <MapPin className="w-5 h-5 text-green-500 mr-4" />
                  <div className="flex-1 flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Bed ID</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{booking.bed_id || "N/A"}</span>
                  </div>
                </div>

                <div className="flex items-center py-3 px-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <Package className="w-5 h-5 text-green-500 mr-4" />
                  <div className="flex-1 flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Package Type</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{booking.package || "N/A"}</span>
                  </div>
                </div>

                <div className="flex items-center py-3 px-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <Building className="w-5 h-5 text-green-500 mr-4" />
                  <div className="flex-1 flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Area</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {booking.property_details?.area || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Payment Information */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Payment Information</h2>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Payment Status</span>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentStatusColor(booking.payment_status)}`}
                  >
                    {booking.payment_status || "Unknown"}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Banknote className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Payment Method</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {booking.payment_method || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-emerald-500 mr-3" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Refundable</span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {booking.is_refundable === null ? "No" : booking.is_refundable || "N/A"}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-200 dark:border-emerald-700">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">Total Amount</span>
                  <span className="font-bold text-2xl text-gray-900 dark:text-gray-100">
                    {formatPrice(booking.total_price, booking.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Financial Breakdown</h2>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Gross Revenue", value: booking.gross_revenue, icon: DollarSign },
                  { label: "OTA Fees", value: booking.ota_fees, icon: DollarSign },
                  { label: "Direct Booking Commission", value: booking.direct_booking_commission, icon: DollarSign },
                  { label: "Service Charge", value: booking.service_charge, icon: DollarSign },
                  { label: "Cleaning Fee", value: booking.cleaning_fee, icon: DollarSign },
                  { label: "AWD", value: booking.awd, icon: DollarSign },
                  { label: "TD", value: booking.td, icon: DollarSign },
                  { label: "VAT", value: booking.vat, icon: DollarSign },
                  { label: "Owner Recharge", value: booking.owner_recharge, icon: DollarSign },
                  { label: "Management Fee", value: booking.management_fee, icon: DollarSign },
                ]
                  .filter((item) => item.value !== null && item.value !== undefined)
                  .map((item, index) => {
                    const IconComponent = item.icon
                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 px-3 bg-white/50 dark:bg-gray-800/50 rounded-lg"
                      >
                        <div className="flex items-center">
                          {/* <IconComponent className="w-4 h-4 text-amber-500 mr-3" /> */}
                          <span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatPrice(item.value, booking.currency)}
                        </span>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>

          {/* Contract Information */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-rose-200 dark:border-rose-800">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Contract Information</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Contract ID</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{booking.contract_id || "N/A"}</span>
                </div>
                <div className="flex justify-between items-start py-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Contract Name</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100 text-right max-w-[60%]">
                    {booking.contract_name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Contract Type</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{booking.contract_type || "N/A"}</span>
                </div>
                <div className="flex justify-between items-start py-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Contract Period</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100 text-right text-sm">
                    {booking.contract_start_date && booking.contract_end_date
                      ? `${dayjs(booking.contract_start_date).format("DD MMM YYYY")} - ${dayjs(booking.contract_end_date).format("DD MMM YYYY")}`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Management & Booking Details */}
          <div className="break-inside-avoid mb-6">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-cyan-200 dark:border-cyan-800">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Management & Booking</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Booking Source</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {booking.booking_source || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    OTA Reference
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                    {booking.ota_booking_reference || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Management Fee</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatPrice(booking.mgmt_fee, booking.currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">BNBME Fee</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatPrice(booking.bnbme_mgmt_fee, booking.currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    Invoice ID
                    <Receipt className="w-3 h-3 ml-1" />
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                    {booking.invoice_id || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingDetailsView

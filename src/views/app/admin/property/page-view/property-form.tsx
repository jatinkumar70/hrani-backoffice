'use client'
import { useFormik } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import * as yup from 'yup'
import { IProperty } from '@/redux/child-reducers/property/property.types'

import Card from '@/components/ui/Card'

import { PropertyFormButton } from '../_components/form-button'
import { PropertyFormStepFive } from '../_components/step-five'
import { PropertyFormStepFour } from '../_components/step-four'
import { PropertyFormStepOne } from '../_components/step-one'
import { PropertyFormStepThree } from '../_components/step-three'
import { PropertyFormStepTwo } from '../_components/step-two'
import { StyledErrorMessage } from '../styles'
// import { PropertyFormStepSix } from "../_components/spte-six";
// import { PropertyFormStepSeven } from "../_components/step-seven";
// import { PropertyFormStepNine } from "../_components/step-nine";
import { PropertyFormStepTen } from '../_components/step-ten'
import { PropertyFormStepEleven } from '../_components/step-eleven'
// import { PropertyFormStepEight } from "../_components/step-eight";

import { useAppDispatch, useAppSelector } from '@/redux/store.hooks'
import { IStoreState } from '@/redux/store.types'
import {
    createPropertyWithCallbackAsync,
    fetchSinglePropertyWithArgsAsync,
    insertPropertyWithPmsAsync,
    upsertPropertyWithCallbackAsync,
} from '@/redux/child-reducers/property/property.actions'
import { ILoadState } from '@/redux/store.enums'
import { useAuthContext } from '@/contexts'
import { defaultProperty } from '@/redux/child-reducers/property'
import CustomStepper from '@/components/ui/CustomStepper/custom-stepper'
import { ArrowLeft, ExternalLink, RefreshCcw, ToggleLeft } from 'lucide-react'
import { apiFrontendUrl } from '@/utils/api'
import { Notification, toast } from '@/components/ui'

// ================================================================
interface Props {
    uuid?: string
}
// ================================================================

// Add type that omits security_deposit
const EXCLUDED_FIELDS = [
    'security_deposit',
    'room_id',
    'insert_ts',
    'create_ts',
    'room_id',
    'nearbyLocations',
    'property_details_unique_id',
    'property_name',
] as const

type ExcludedFields = (typeof EXCLUDED_FIELDS)[number]
type PropertyWithoutExcludedFields = Omit<IProperty, ExcludedFields>

const PropertyForm = () => {
    const [profileImage, setProfileImage] = useState<File | null>(null)
    const params = useParams()
    const actualUuid = params.uuid
    const dispatch = useAppDispatch()
    const [isRefreshing, setIsRefreshing] = useState(false)

    const { user_info } = useAuthContext()
    const role_value = user_info?.role_value

    const { data: propertyData, loading: propertyLoading } = useAppSelector(
        (storeState: IStoreState) => storeState.property.single_property,
    )

    const isLoading = propertyLoading === ILoadState.pending

    const isManager = role_value === 'PROPERTY_MANAGER'
    const isUpdate = actualUuid ? true : false

    const steps = actualUuid
        ? [
              'Details',
              'Images',
              'Description',
              // "Room Features",
              'Location',
              'Nearby Places',
              'Amenities',
              // "Food & Dining",
              // "Policies",
              // "Rooms",
              // "Booking Questions",
          ]
        : ['Property Info']
    const [activeStep, setActiveStep] = React.useState(0)
    const [loading, setLoading] = React.useState(false)
    const [stepperLoading, setStepperLoading] = React.useState(false)
    const [clickedButtonType, setClickedButtonType] = React.useState('')
    const navigate = useNavigate()

    // FORM FIELDS VALIDATION SCHEMA
    const VALIDATION_SCHEMA = yup.object().shape({
        property_details_name: yup
            .string()
            .required('Property name is required'),
        user_uuid: yup.string().required('Manager name is required'),
    })

    const {
        values,
        errors,
        handleChange,
        handleSubmit,
        setValues,
        setFieldValue,
    } = useFormik({
        initialValues: defaultProperty,
        validationSchema: VALIDATION_SCHEMA,
        onSubmit: async (values, { setSubmitting }) => {
            const isFinalStep = clickedButtonType === 'SUBMIT'
            setLoading(isFinalStep)
            setStepperLoading(!isFinalStep)

            // Create a new object without excluded fields
            const excludedValues = EXCLUDED_FIELDS.reduce<Partial<IProperty>>(
                (acc, field) => {
                    if (field in acc) {
                        const { [field]: _, ...rest } = acc
                        return rest
                    }
                    return acc
                },
                { ...values },
            )

            try {
                if (actualUuid) {
                    const updatePayload: IProperty = {
                        ...excludedValues,
                        // nearbyLocations: values.nearbyLocations,
                        user_uuid: values.user_uuid,
                        user_name: values.user_name,
                        is_pet_friendly: !!excludedValues.is_pet_friendly,
                        food_and_dinning: Array.isArray(
                            excludedValues.food_and_dinning,
                        )
                            ? excludedValues.food_and_dinning
                            : [],
                        rule_allowed: Array.isArray(excludedValues.rule_allowed)
                            ? excludedValues.rule_allowed
                            : [],
                        rule_not_allowed: Array.isArray(
                            excludedValues.rule_not_allowed,
                        )
                            ? excludedValues.rule_not_allowed
                            : [],
                        property_details_uuid: values.property_details_uuid,
                        property_details_name: values.property_details_name,
                        property_type: values.property_type,
                        property_images: values.property_images,
                        about_property: values.about_property,
                        floor_plan: values.floor_plan,
                        property_details_profile_pic:
                            values.property_details_profile_pic,
                        property_place_id: values.property_place_id,
                        nearby_places: values.nearby_places,
                        property_rating: values.property_rating,
                        yt_walkthrough_video: values.yt_walkthrough_video,
                        property_address_line_1: values.property_address_line_1,
                        property_address_line_2: values.property_address_line_2,
                        property_city: values.property_city,
                        area: values.area,
                        nearby_type: values.nearby_type,
                        property_state: values.property_state,
                        property_pincode: values.property_pincode,
                        property_country: values.property_country,
                        longitude: values.longitude,
                        latitude: values.latitude,
                        amenities: values.amenities,
                        checkin_time: values.checkin_time,
                        checkout_time: values.checkout_time,
                        property_policies: values.property_policies,
                        BookingQuestion: values.BookingQuestion,
                        status: values.status,
                        id: values.id,
                        account: values.account,
                        currency: values.currency,
                        room_name: values.room_name,
                        slug: values.slug,
                        max_occupancy: values.max_occupancy,
                        bedrooms: values.bedrooms,
                        available_beds: values.available_beds,
                        queen_beds: values.queen_beds,
                        king_beds: values.king_beds,
                        single_beds: values.single_beds,
                        double_beds: values.double_beds,
                        bathroom_full: Number(values.bathroom_full) || 0,
                        bathroom_half: Number(values.bathroom_half) || 0,
                        property_subtype: values.property_subtype,
                        phone: values.phone,
                        mobile: values.mobile,
                        fax: values.fax,
                        email: values.email,
                        web: values.web,
                        contactFirstName: values.contactFirstName,
                        contactLastName: values.contactLastName,
                        checkInEnd: values.checkInEnd,
                        offerType: values.offerType,
                        controlPriority: values.controlPriority,
                        sellPriority: values.sellPriority,
                        bookingPageMultiplier: values.bookingPageMultiplier,
                        permit: values.permit,
                        roomChargeDisplay: values.roomChargeDisplay,
                        templates: values.templates,
                        groupKeywords: values.groupKeywords,
                        bookingRules: values.bookingRules,
                        bookingQuestions: values.bookingQuestions,
                        webhooks: values.webhooks,
                        property_highlights: values.property_highlights,
                        roomTypes: values.roomTypes,
                        map: values.map,
                        security_deposit: values.security_deposit || [],
                        booking_request: Boolean(values.booking_request),
                    }

                    dispatch(
                        upsertPropertyWithCallbackAsync({
                            payload: updatePayload,
                            onSuccess: (isSuccess, data) => {
                                if (isSuccess && isFinalStep) {
                                    navigate(
                                        isManager
                                            ? '/app/properties'
                                            : '/app/properties',
                                    )
                                } else if (isSuccess) {
                                    toast.push(
                                        <Notification type="success">
                                            Property updated successfully
                                        </Notification>,
                                        { placement: 'top-center' },
                                    )
                                }
                            },
                        }),
                    )
                } else {
                    const createPayload: IProperty = {
                        ...excludedValues,
                        user_uuid: values.user_uuid,
                        user_name: values.user_name,
                        property_details_name: values.property_details_name,
                        status: 'ACTIVE',
                        food_and_dinning: [],
                        property_details_uuid: '',
                        property_type: '',
                        property_images: [],
                        about_property: '',
                        floor_plan: null,
                        property_details_profile_pic: null,
                        property_place_id: '',
                        nearby_places: [],
                        property_rating: '',
                        yt_walkthrough_video: [],
                        property_address_line_1: '',
                        property_address_line_2: '',
                        property_city: '',
                        area: '',
                        nearby_type: '',
                        property_state: '',
                        property_pincode: '',
                        property_country: '',
                        longitude: '',
                        latitude: '',
                        amenities: [],
                        checkin_time: '',
                        checkout_time: '',
                        property_policies: {
                            bookingType: 'autoConfirmed',
                            priceRounding: 'none',
                            dailyPriceType: 'default',
                            bookingNearType: 'autoConfirmed',
                            bookingCutOffHour: 0,
                            vatRatePercentage: 0,
                            dailyPriceStrategy: 'allowLower',
                            bookingNearTypeDays: null,
                            allowGuestCancellation: {
                                type: 'never',
                            },
                        },
                        BookingQuestion: {
                            order: null,
                            usage: 'notUsed',
                            type: undefined,
                        },
                        rule_allowed: [],
                        rule_not_allowed: [],
                        id: '',
                        account: '',
                        currency: 'USD',
                        room_name: '',
                        slug: '',
                        is_pet_friendly: false,
                        max_occupancy: 0,
                        // bedrooms: 0,
                        available_beds: 0,
                        queen_beds: 0,
                        king_beds: 0,
                        single_beds: 0,
                        double_beds: 0,
                        bathroom_full: 0,
                        bathroom_half: 0,
                        property_subtype: '',
                        phone: '',
                        mobile: '',
                        fax: '',
                        email: '',
                        web: '',
                        contactFirstName: '',
                        contactLastName: '',
                        checkInEnd: '',
                        offerType: '',
                        controlPriority: '',
                        sellPriority: '',
                        bookingPageMultiplier: 1.0,
                        permit: '',
                        roomChargeDisplay: '',
                        bedrooms: 0,
                        templates: [],
                        groupKeywords: [],
                        bookingRules: [],
                        bookingQuestions: [],
                        webhooks: [],
                        property_highlights: [],
                        roomTypes: [],
                        map: function () {
                            throw new Error('Function not implemented.')
                        },
                        // nearbyLocations: [],
                        security_deposit: [],
                        booking_request: false,
                    }

                    dispatch(
                        createPropertyWithCallbackAsync({
                            payload: createPayload,
                            onSuccess: (isSuccess, data) => {
                                if (isSuccess) {
                                    navigate(
                                        isManager
                                            ? '/app/properties'
                                            : '/app/properties',
                                    )
                                }
                            },
                        }),
                    )
                }
            } finally {
                setLoading(false)
                setStepperLoading(false)
                setSubmitting(false)
            }
        },
    })

    const isActive = values.status === 'ACTIVE'

    // handle step click
    const handleStepClick = (step: number) => {
        setActiveStep(step)
    }

    // handle button click
    const handleButtonClick = (type: string) => {
        setClickedButtonType(type)
        if (type === 'SUBMIT') {
            handleSubmit()
        } else if (type === 'SAVE_AND_CONTINUE') {
            setActiveStep((pre) => pre + 1)
            handleSubmit()
        } else if (type === 'SAVE') {
            handleSubmit()
        } else if (type === 'CLOSE') {
            navigate(isManager ? '/app/properties' : '/app/properties')
        } else if (type === 'BACK') {
            setActiveStep((pre) => pre - 1)
        } else if (type === 'CONTINUE') {
            setActiveStep((pre) => pre + 1)
        }
    }

    // fetch the data while editing the form
    useEffect(() => {
        if (actualUuid) {
            dispatch(fetchSinglePropertyWithArgsAsync(actualUuid))
        }
    }, [actualUuid, dispatch])

    // Update form values when property data changes
    useEffect(() => {
        if (propertyData && propertyData.property_details_uuid) {
            setValues({
                ...propertyData,
                nearbyLocations: propertyData.nearbyLocations ?? [],
            })
        }
    }, [propertyData, setValues])

    // show all the errors
    const renderErrors = () => {
        const flattenErrors = (errorObj: any) => {
            let result: string[] = []
            for (const key in errorObj) {
                if (typeof errorObj[key] === 'object') {
                    result = result.concat(flattenErrors(errorObj[key]))
                } else {
                    result.push(errorObj[key])
                }
            }
            return result
        }

        return flattenErrors(errors).map((error: string, index) => (
            <StyledErrorMessage key={index}>{error}</StyledErrorMessage>
        ))
    }

    const handleRefresh = async (propertyId: string, id: string) => {
        setIsRefreshing(true)
        try {
            await insertPropertyWithPmsAsync(
                { propertyId: propertyId, id: id, page: 1 },
                (isSuccess, data) => {
                    if (isSuccess) {
                        console.log('Properties refreshed successfully!', data)
                        dispatch(fetchSinglePropertyWithArgsAsync(id))
                    } else {
                        toast.push(
                            <Notification type="danger">
                                Failed to refresh properties
                            </Notification>,
                            { placement: 'top-center' },
                        )
                    }
                    setIsRefreshing(false)
                },
            )
        } catch (error: any) {
            toast.push(
                <Notification type="danger">Refresh not working</Notification>,
                { placement: 'top-center' },
            )
            setIsRefreshing(false)
        }
    }

    console.log('PropertyForm values===> ', values)
    console.log('PropertyForm errors===> ', errors)

    return (
        <Card className="h-full">
            <div className="md:p-4 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center py-4 justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            className="text-muted-foreground hover:text-primary"
                            onClick={() => navigate('/app/dashboard/property')}
                        >
                            <ArrowLeft />
                        </button>
                        <h1 className="text-xl sm:text-2xl font-bold heading-text">
                            {isUpdate ? 'Edit' : 'Create'} Property
                            {isUpdate && values.property_details_name
                                ? ` : ${values.property_details_name}`
                                : ''}
                        </h1>
                    </div>
                    {/* <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4"> */}
                    <div className="flex items-start gap-3">
                        {/* <ToggleButton
                            size="lg"
                            value={isActive}
                            activeText="Active"
                            inactiveText="Inactive"
                            onChange={(newValue) => {
                                setFieldValue(
                                    'status',
                                    newValue ? 'ACTIVE' : 'INACTIVE',
                                )
                            }}
                        /> */}
                        <button
                            className="flex items-center gap-1.5 px-3 py-1.5 text-md bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full border border-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() =>
                                handleRefresh(
                                    values.id,
                                    values.property_details_uuid,
                                )
                            }
                            disabled={isRefreshing}
                        >
                            <RefreshCcw
                                className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
                            />
                            <span>
                                {isRefreshing ? 'Refreshing...' : 'Refresh'}
                            </span>
                        </button>
                        <button
                            className="flex items-center gap-1.5 px-3 py-1.5 text-md bg-primary/5 hover:bg-primary/10 text-primary rounded-full border border-primary/20 transition-all duration-200"
                            onClick={() =>
                                window.open(
                                    `${apiFrontendUrl}/property/${values.slug}`,
                                    '_blank',
                                )
                            }
                        >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>Visit</span>
                        </button>
                    </div>
                </div>

                {isUpdate && (
                    <div className="overflow-x-auto">
                        <CustomStepper
                            steps={steps}
                            activeStep={activeStep}
                            loading={stepperLoading || isLoading}
                            handleStepClick={handleStepClick}
                        />
                    </div>
                )}

                {errors && Object.keys(errors).length > 0 && (
                    <div className="bg-error-subtle border border-error rounded-md p-4 mb-4">
                        {renderErrors()}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="w-12 h-12 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="rounded-lg md:p-4 sm:p-0 mb-8">
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-3">
                                {activeStep === 0 && (
                                    <PropertyFormStepOne
                                        values={values}
                                        handleChange={handleChange}
                                        setFieldValue={setFieldValue}
                                        touched
                                        errors
                                        isManager={isManager}
                                        isUpdate={isUpdate}
                                    />
                                )}
                                {isUpdate && activeStep === 1 && (
                                    <PropertyFormStepTwo
                                        values={values}
                                        setFieldValue={setFieldValue}
                                        setValues={setValues}
                                        handleChange={handleChange}
                                        handlePropertyPicImageChange={
                                            setProfileImage
                                        }
                                        asPayload={{
                                            title: values.property_details_name
                                                ?.split(' ')
                                                .join('_'),
                                        }}
                                    />
                                )}
                                {isUpdate && activeStep === 2 && (
                                    <PropertyFormStepThree
                                        values={values}
                                        handleChange={handleChange}
                                        setFieldValue={setFieldValue}
                                    />
                                )}
                                {isUpdate && activeStep === 3 && (
                                    <PropertyFormStepFour
                                        values={values}
                                        handleChange={handleChange}
                                        setValues={setValues}
                                    />
                                )}
                                {isUpdate && activeStep === 4 && (
                                    <PropertyFormStepEleven
                                        setFieldValue={setFieldValue}
                                        values={values}
                                        handleChange={handleChange}
                                    />
                                )}
                                {isUpdate && activeStep === 5 && (
                                    <PropertyFormStepFive
                                        setFieldValue={setFieldValue}
                                        values={values}
                                    />
                                )}
                                {isUpdate && activeStep === 6 && (
                                    <PropertyFormStepTen
                                        setFieldValue={setFieldValue}
                                        values={values}
                                        handleSubmit={handleSubmit}
                                    />
                                )}

                                <div className="fixed overflow-x-auto pl-30 bottom-0 left-0 right-0 p-4 sm:p-2  z-50 max-w-full mx-auto flex justify-center bg-card/80 ">
                                    <PropertyFormButton
                                        isUpdate={isUpdate}
                                        activeStep={activeStep}
                                        steps={steps}
                                        onButtonClick={handleButtonClick}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                )}
                {loading && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="p-4 sm:p-6 rounded-lg shadow-lg flex flex-col items-center bg-card mx-4">
                            <div className="w-12 h-12 border-4 border-t-transparent border-primary rounded-full animate-spin mb-4"></div>
                            <p className="text-muted-foreground">
                                Processing...
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}

export default PropertyForm

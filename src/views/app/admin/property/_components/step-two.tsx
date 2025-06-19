'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { produce } from 'immer'
import {
    fetchSinglePropertyWithArgsAsync,
    type IProperty,
} from '@/redux/child-reducers/property'
import { ImageAlbumRow } from '@/components/ImageUpload/ImageAlbumRow'
import { HiPlus } from 'react-icons/hi'
import { TbTrash } from 'react-icons/tb'
import { api } from '@/utils/api'
import { Button, Notification, toast } from '@/components/ui'
import { useAppDispatch } from '@/redux'
import Dialog from '@/components/ui/Dialog'
import {
    Upload,
    ImageIcon,
    FileArchive,
    CheckCircle,
    Clock,
    AlertCircle,
    Info,
    Folder,
    FileImage,
    Zap,
    Activity,
    Move,
    ChevronDown,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import FileUploaderAsyncV2 from '@/components/ImageUpload/FileUploaderAsyncV2'

const getFileIcon = (filename: string) => {
    const extension = filename.toLowerCase().split('.').pop()
    const isImage = [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'bmp',
        'webp',
        'svg',
    ].includes(extension || '')
    const isZip = ['zip', 'rar', '7z', 'tar', 'gz'].includes(extension || '')

    if (isZip) {
        return <FileArchive className="h-5 w-5 text-purple-500" />
    } else if (isImage) {
        return <ImageIcon className="h-5 w-5 text-blue-500" />
    } else {
        return <Folder className="h-5 w-5 text-gray-500" />
    }
}

const extractFilenameFromPayload = (payload: string) => {
    try {
        const parsed = JSON.parse(payload)
        if (parsed.files && Array.isArray(parsed.files)) {
            return parsed.files
        }
        // Fallback: try to extract filename from the payload string
        const match = payload.match(
            /"([^"]*\.(zip|jpg|jpeg|png|gif|bmp|webp|svg|rar|7z|tar|gz))"/i,
        )
        return match ? [match[1]] : []
    } catch {
        // If JSON parsing fails, try regex extraction
        const matches = payload.match(
            /([^/\\]+\.(zip|jpg|jpeg|png|gif|bmp|webp|svg|rar|7z|tar|gz))/gi,
        )
        return matches || []
    }
}

interface Props {
    values: IProperty
    setFieldValue: (label: string, value: any) => void
    setValues: any
    handleChange: any
    handlePropertyPicImageChange: (file: File) => void
    asPayload: {
        [key: string]: string | number | null
    }
}

export function PropertyFormStepTwo({
    values,
    setFieldValue,
    setValues,
    handleChange,
    handlePropertyPicImageChange,
    asPayload,
}: Props) {
    const [isUploading, setIsUploading] = useState(false)
    const [isNamingConventionsOpen, setIsNamingConventionsOpen] =
        useState(false)
    const [processLogsUuid, setProcessLogsUuid] = useState<string | null>(null)
    const [processLogs, setProcessLogs] = useState<any[]>([])
    const [isPolling, setIsPolling] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const dispatch = useAppDispatch()

    // Album expansion state
    const [expandedAlbumIndex, setExpandedAlbumIndex] = useState<number | null>(
        null,
    )
    const [selectedImages, setSelectedImages] = useState<string[]>([])
    const [selectedAlbum, setSelectedAlbum] = useState<string>('')

    // Polling effect for process logs
    useEffect(() => {
        let pollInterval: NodeJS.Timeout

        const fetchProcessLogs = async () => {
            if (!processLogsUuid) return

            try {
                const response = await api.get(
                    '/dataManagement/get-process-logs',
                    {
                        params: { process_logs_uuid: processLogsUuid },
                    },
                )

                const logs = response.data.data || []
                setProcessLogs(logs)

                // Check if process is complete
                const isComplete = logs.some(
                    (log: any) => log.status === 'SUCCESS',
                )
                if (isComplete) {
                    setIsPolling(false)
                    setProcessLogsUuid(null)
                    toast.push(
                        <Notification type="success" title="Success">
                            Image organization process completed successfully
                        </Notification>,
                    )
                    dispatch(
                        fetchSinglePropertyWithArgsAsync(
                            values.property_details_uuid as string,
                        ),
                    ).finally(() => {
                        setIsUploading(false)
                    })
                }
            } catch (error) {
                console.error('Error fetching process logs:', error)
                setIsPolling(false)
                setProcessLogsUuid(null)
                setIsUploading(false)
            }
        }

        if (isPolling && processLogsUuid) {
            pollInterval = setInterval(fetchProcessLogs, 2000)
        }

        return () => {
            if (pollInterval) {
                clearInterval(pollInterval)
            }
        }
    }, [isPolling, processLogsUuid, dispatch, values.property_details_uuid])

    // Logic of Image Move Function
    const moveAllImagesToAnotherAlbum = (
        fromAlbumIndex: number,
        toAlbumIndex: number,
        imagesToMove: string[],
    ) => {
        if (!imagesToMove.length) return

        setValues((prev: any) =>
            produce(prev, (draft: any) => {
                const fromAlbum = draft.property_images[fromAlbumIndex]
                const toAlbum = draft.property_images[toAlbumIndex]

                // add only the selected images:
                toAlbum.paths.push(...imagesToMove)

                // remove only those selected:
                fromAlbum.paths = fromAlbum.paths.filter(
                    (path: string) => !imagesToMove.includes(path),
                )
            }),
        )
    }

    const handlePropertyImageChange = (
        index: number,
        key: string,
        value: any,
    ) => {
        setValues((prev: any) =>
            produce(prev, (draft: any) => {
                draft.property_images[index][key] = value
            }),
        )
    }

    const handleAdd = () => {
        const newValues = produce(values, (draftValues) => {
            if (draftValues.property_images.length > 0) {
                draftValues.property_images?.push({
                    album_name: '',
                    paths: [],
                })
            } else {
                draftValues.property_images = [
                    {
                        album_name: '',
                        paths: [],
                    },
                ]
            }
        })
        setValues(newValues)
    }

    const handleDelete = () => {
        const newValues = produce(values, (draftValues) => {
            draftValues.property_images.splice(0, 1)
        })
        setValues(newValues)
    }

    // Album expansion handlers
    const handleAlbumToggle = (index: number) => {
        if (expandedAlbumIndex === index) {
            setExpandedAlbumIndex(null)
            setSelectedImages([])
            setSelectedAlbum('')
        } else {
            setExpandedAlbumIndex(index)
            setSelectedImages([])
            setSelectedAlbum('')
        }
    }

    const handleSelectImage = (filePath: string) => {
        setSelectedImages((prev) =>
            prev.includes(filePath)
                ? prev.filter((i) => i !== filePath)
                : [...prev, filePath],
        )
    }

    const handleMove = (toAlbumName: string) => {
        if (expandedAlbumIndex === null) return

        const toIndex = values.property_images.findIndex(
            (item: any) => item.album_name === toAlbumName,
        )
        if (toIndex !== -1 && selectedImages.length) {
            moveAllImagesToAnotherAlbum(
                expandedAlbumIndex,
                toIndex,
                selectedImages,
            )
            setSelectedImages([])
            setSelectedAlbum('')
        }
    }

    const handleClearSelection = () => {
        setSelectedImages([])
    }

    const handleImageOrganizerUpload = async (files: File[]) => {
        try {
            setIsUploading(true)
            const formdata = new FormData()
            files.forEach((file) => {
                formdata.append('files', file)
            })
            formdata.append(
                'property_details_uuid',
                values.property_details_uuid as string,
            )

            const res = await api.post('/property/image-organiser', formdata)

            // Start polling with the new process UUID
            setProcessLogsUuid(res.data.data)
            setIsPolling(true)

            toast.push(
                <Notification type="info" title="Success">
                    Image organization process started. Please wait for the
                    process to complete.
                </Notification>,
            )
        } catch (error) {
            console.error('Error uploading images to organizer:', error)
            setIsUploading(false)
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to start image organization process
                </Notification>,
            )
        }
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (!isUploading && e.dataTransfer.files.length > 0) {
            handleImageOrganizerUpload(Array.from(e.dataTransfer.files))
        }
    }

    const getProgressPercentage = () => {
        if (!processLogs.length) return 0
        const currentStatus = processLogs[processLogs.length - 1]?.status
        switch (currentStatus) {
            case 'QUEUE':
                return 25
            case 'IN_PROGRESS':
                return 65
            case 'SUCCESS':
                return 100
            default:
                return 0
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'SUCCESS':
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'IN_PROGRESS':
                return (
                    <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
                )
            case 'QUEUE':
                return <Clock className="h-4 w-4 text-yellow-500" />
            default:
                return <AlertCircle className="h-4 w-4 text-gray-400" />
        }
    }

    return (
        <div className="space-y-8 ">
            {/* Main Image Organizer Card */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-xl ">
                {/* Header with gradient background */}
                <div className="bg-gray-100 p-4 md:px-8 md:py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="md:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Zap className="h-4 w-4 md:h-8 md:w-8 text-gray-800" />
                            </div>
                            <div>
                                <h2 className="md:text-2xl text-lg font-bold text-gray-700">
                                    Image Organizer
                                </h2>
                                <p className="text-gray-800 mt-1 ">
                                    Automatically organize and categorize your
                                    property images
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center space-x-2 text-gray-800">
                            <FileImage className="h-5 w-5 text-gray-800" />
                            <span className="text-sm text-gray-800">
                                Smart Organization
                            </span>
                        </div>
                    </div>
                </div>

                {/* Upload Area */}
                <div className="md:p-8 p-4">
                    <div
                        className={`relative border-2 border-dashed rounded-2xl md:p-12 p-6 transition-all duration-300 ${
                            dragActive
                                ? 'border-blue-400 bg-blue-50 scale-[1.02]'
                                : isUploading
                                  ? 'border-gray-300 bg-gray-50'
                                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="flex flex-col items-center justify-center text-center space-y-6">
                            {isUploading ? (
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="relative">
                                        <div className="md:w-20 md:h-20 w-14 h-14 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                                        <Upload className="absolute inset-0 m-auto h-8 w-8 text-blue-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="md:text-xl text:sm font-semibold text-gray-800">
                                            Processing Your Images
                                        </h3>
                                        <p className="text-gray-600">
                                            We are organizing your files...
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="relative">
                                        <div className="md:w-20 md:h-20 w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center shadow-lg">
                                            <Upload className="md:h-10 md:w-10 h-6 w-6 text-black" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 md:w-8 md:h-8 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                                            <Zap className="h-4 w-4 text-white" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="md:text-2xl text-sm font-bold text-gray-800">
                                            Drop your files here
                                        </h3>
                                        <p className="text-gray-600 max-w-md">
                                            Drag and drop your property images
                                            or ZIP files, or click to browse
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <label className="group cursor-pointer">
                                            <div className="px-8 py-4 bg-gray-100 rounded-xl text-black font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-3">
                                                <Upload className="h-5 w-5" />
                                                <span>Choose Files</span>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                multiple
                                                accept="image/*,.zip"
                                                disabled={isUploading}
                                                onChange={(e) => {
                                                    if (
                                                        e.target.files &&
                                                        !isUploading
                                                    ) {
                                                        handleImageOrganizerUpload(
                                                            Array.from(
                                                                e.target.files,
                                                            ),
                                                        )
                                                    }
                                                }}
                                            />
                                        </label>

                                        <Button
                                            onClick={() =>
                                                setIsNamingConventionsOpen(true)
                                            }
                                            className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-blue-400 hover:text-blue-600 transition-all duration-200 flex items-center space-x-2"
                                            type="button"
                                        >
                                            <Info className="h-5 w-5" />
                                            <span>Naming Guide</span>
                                        </Button>
                                    </div>

                                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                                        <div className="flex items-center space-x-2">
                                            <ImageIcon className="h-5 w-5 text-blue-500" />
                                            <span>Images</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <FileArchive className="h-5 w-5 text-purple-500" />
                                            <span>ZIP Files</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Progress Section */}
                    {(isPolling || isUploading) && (
                        <div className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-gray-800 flex items-center space-x-2">
                                        <Activity className="h-5 w-5 text-blue-600" />
                                        <span>Processing Status</span>
                                    </h4>
                                    <div className="flex items-center space-x-2">
                                        {processLogs.length > 0 &&
                                            getStatusIcon(
                                                processLogs[
                                                    processLogs.length - 1
                                                ]?.status,
                                            )}
                                        <span className="text-sm font-medium text-gray-600">
                                            {processLogs.length > 0
                                                ? processLogs[
                                                      processLogs.length - 1
                                                  ]?.status
                                                : 'INITIALIZING'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Progress Bar */}
                            <div className="px-6 py-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-gray-700">
                                        Progress
                                    </span>
                                    <span className="text-sm font-bold text-blue-600">
                                        {getProgressPercentage()}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                                        style={{
                                            width: `${getProgressPercentage()}%`,
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Process Logs */}
                            {processLogs.length > 0 && (
                                <div className="px-6 pb-6">
                                    <div className="max-h-48 overflow-y-auto space-y-3">
                                        {processLogs.map(
                                            (log: any, index: number) => {
                                                const filenames =
                                                    extractFilenameFromPayload(
                                                        log.raw_payload,
                                                    )

                                                return (
                                                    <div
                                                        key={
                                                            log.process_logs_unique_id
                                                        }
                                                        className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-100"
                                                    >
                                                        <div className="flex-shrink-0 mt-0.5">
                                                            {getStatusIcon(
                                                                log.status,
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-sm font-medium text-gray-800">
                                                                    {log.type}
                                                                </p>
                                                                <span className="text-xs text-gray-500">
                                                                    {new Date(
                                                                        log.create_ts,
                                                                    ).toLocaleTimeString()}
                                                                </span>
                                                            </div>

                                                            {/* Enhanced file display */}
                                                            {filenames.length >
                                                            0 ? (
                                                                <div className="mt-2 space-y-2">
                                                                    {filenames.map(
                                                                        (
                                                                            filename: string,
                                                                            fileIndex: number,
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    fileIndex
                                                                                }
                                                                                className="flex items-center space-x-3 p-2 bg-white rounded-lg border border-gray-100"
                                                                            >
                                                                                {getFileIcon(
                                                                                    filename,
                                                                                )}
                                                                                <div className="flex-1 min-w-0">
                                                                                    <p
                                                                                        className="text-sm font-medium text-gray-700 truncate"
                                                                                        title={
                                                                                            filename
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            filename
                                                                                        }
                                                                                    </p>
                                                                                    <p className="text-xs text-gray-500">
                                                                                        {filename
                                                                                            .toLowerCase()
                                                                                            .split(
                                                                                                '.',
                                                                                            )
                                                                                            .pop()
                                                                                            ?.toUpperCase()}{' '}
                                                                                        file
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-gray-600 mt-1">
                                                                    {
                                                                        log.raw_payload
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            },
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Album Management */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                            <Folder className="h-5 w-5 text-blue-600" />
                            <span className="md:text-2xl text-lg">
                                Image Albums
                            </span>
                        </h3>
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={values.property_images?.length === 1}
                                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                                    values.property_images?.length === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                }`}
                            >
                                <TbTrash className="h-4 w-4" />
                                <span>Delete</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleAdd}
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
                            >
                                <HiPlus className="h-4 w-4" />
                                <span>Add Album</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="space-y-6">
                        {/* Render albums row by row */}
                        {(() => {
                            const albums = values.property_images || []
                            const itemsPerRow = 3
                            const rows = []

                            for (
                                let i = 0;
                                i < albums.length;
                                i += itemsPerRow
                            ) {
                                const rowItems = albums.slice(
                                    i,
                                    i + itemsPerRow,
                                )
                                const rowIndex = Math.floor(i / itemsPerRow)

                                rows.push(
                                    <div key={`row-${rowIndex}`}>
                                        {/* Row of albums */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                            {rowItems.map((item, itemIndex) => {
                                                const globalIndex =
                                                    i + itemIndex
                                                return (
                                                    <ImageAlbumRow
                                                        key={globalIndex}
                                                        index={globalIndex}
                                                        dataObj={item}
                                                        albumList={
                                                            values.property_images
                                                        }
                                                        handleImageChange={
                                                            handlePropertyImageChange
                                                        }
                                                        moveImagesToAnotherAlbum={
                                                            moveAllImagesToAnotherAlbum
                                                        }
                                                        asPayload={asPayload}
                                                        expanded={
                                                            expandedAlbumIndex ===
                                                            globalIndex
                                                        }
                                                        onToggle={
                                                            handleAlbumToggle
                                                        }
                                                        selectedImages={
                                                            selectedImages
                                                        }
                                                        onSelectImage={
                                                            handleSelectImage
                                                        }
                                                        selectedAlbum={
                                                            selectedAlbum
                                                        }
                                                        onSelectedAlbumChange={
                                                            setSelectedAlbum
                                                        }
                                                        onMove={handleMove}
                                                        onClearSelection={
                                                            handleClearSelection
                                                        }
                                                    />
                                                )
                                            })}
                                        </div>

                                        {/* Expanded content appears right after this row if any album in this row is expanded */}
                                        {expandedAlbumIndex !== null &&
                                            expandedAlbumIndex >= i &&
                                            expandedAlbumIndex <
                                                i + itemsPerRow && (
                                                <AnimatePresence>
                                                    <motion.div
                                                        initial={{
                                                            height: 0,
                                                            opacity: 0,
                                                        }}
                                                        animate={{
                                                            height: 'auto',
                                                            opacity: 1,
                                                        }}
                                                        exit={{
                                                            height: 0,
                                                            opacity: 0,
                                                        }}
                                                        transition={{
                                                            duration: 0.3,
                                                        }}
                                                        className="mb-6 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
                                                    >
                                                        <div className="p-6 bg-gray-50 border-b border-gray-200">
                                                            <h3 className="text-lg font-semibold text-gray-800">
                                                                {values
                                                                    .property_images[
                                                                    expandedAlbumIndex
                                                                ]?.album_name ||
                                                                    'Album Details'}
                                                            </h3>
                                                        </div>
                                                        <div className="p-6 space-y-6">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Album Name
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="w-full px-4 py-2.5 border bg-gray-50 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                                    value={
                                                                        values
                                                                            .property_images[
                                                                            expandedAlbumIndex
                                                                        ]
                                                                            ?.album_name ||
                                                                        ''
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        handlePropertyImageChange(
                                                                            expandedAlbumIndex,
                                                                            'album_name',
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    disabled
                                                                />
                                                            </div>

                                                            <div>
                                                                <FileUploaderAsyncV2
                                                                    asPayload={
                                                                        asPayload
                                                                    }
                                                                    files={
                                                                        values
                                                                            .property_images[
                                                                            expandedAlbumIndex
                                                                        ]
                                                                            ?.paths ||
                                                                        []
                                                                    }
                                                                    selectedImages={
                                                                        selectedImages
                                                                    }
                                                                    onSelectImage={
                                                                        handleSelectImage
                                                                    }
                                                                    onFilesChange={(
                                                                        data: string[],
                                                                    ) =>
                                                                        handlePropertyImageChange(
                                                                            expandedAlbumIndex,
                                                                            'paths',
                                                                            data,
                                                                        )
                                                                    }
                                                                />
                                                            </div>

                                                            {selectedImages.length >
                                                                0 && (
                                                                <motion.div
                                                                    initial={{
                                                                        opacity: 0,
                                                                        y: 10,
                                                                    }}
                                                                    animate={{
                                                                        opacity: 1,
                                                                        y: 0,
                                                                    }}
                                                                    exit={{
                                                                        opacity: 0,
                                                                        y: 10,
                                                                    }}
                                                                    className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-sm"
                                                                >
                                                                    <div className="flex items-center gap-3 mb-4">
                                                                        <Move
                                                                            size={
                                                                                20
                                                                            }
                                                                            className="text-blue-600"
                                                                        />
                                                                        <h4 className="font-semibold text-blue-800 text-lg">
                                                                            Move{' '}
                                                                            {
                                                                                selectedImages.length
                                                                            }{' '}
                                                                            selected{' '}
                                                                            {selectedImages.length ===
                                                                            1
                                                                                ? 'image'
                                                                                : 'images'}
                                                                        </h4>
                                                                    </div>

                                                                    <div className="relative">
                                                                        <select
                                                                            value={
                                                                                selectedAlbum
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setSelectedAlbum(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                            className="w-full px-4 py-3 bg-white border border-blue-300 rounded-lg font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none transition-all duration-200"
                                                                        >
                                                                            <option
                                                                                value=""
                                                                                disabled
                                                                            >
                                                                                Select
                                                                                destination
                                                                                album
                                                                            </option>
                                                                            {values.property_images
                                                                                ?.filter(
                                                                                    (
                                                                                        _,
                                                                                        idx,
                                                                                    ) =>
                                                                                        idx !==
                                                                                        expandedAlbumIndex,
                                                                                )
                                                                                .map(
                                                                                    (
                                                                                        album,
                                                                                        idx,
                                                                                    ) => (
                                                                                        <option
                                                                                            key={
                                                                                                idx
                                                                                            }
                                                                                            value={
                                                                                                album.album_name
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                album.album_name
                                                                                            }
                                                                                        </option>
                                                                                    ),
                                                                                )}
                                                                        </select>
                                                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                                            <ChevronDown className="h-4 w-4 text-gray-500" />
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex justify-end gap-3 mt-4">
                                                                        <button
                                                                            type="button"
                                                                            onClick={
                                                                                handleClearSelection
                                                                            }
                                                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                selectedAlbum &&
                                                                                handleMove(
                                                                                    selectedAlbum,
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                !selectedAlbum
                                                                            }
                                                                            className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm ${
                                                                                selectedAlbum
                                                                                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                                                                                    : 'bg-blue-400 cursor-not-allowed'
                                                                            }`}
                                                                        >
                                                                            Move
                                                                            to
                                                                            Album
                                                                        </button>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                </AnimatePresence>
                                            )}
                                    </div>,
                                )
                            }

                            return rows
                        })()}
                    </div>
                </div>
            </div>

            {/* Enhanced Naming Conventions Dialog */}
            <Dialog
                isOpen={isNamingConventionsOpen}
                onClose={() => setIsNamingConventionsOpen(false)}
                onRequestClose={() => setIsNamingConventionsOpen(false)}
                width={900}
            >
                <div className="p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Info className="h-6 w-6 text-blue-600" />
                        </div>
                        <h4 className="text-2xl font-bold text-gray-800">
                            Image Naming Conventions
                        </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* First Column */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                                <h5 className="font-semibold text-blue-800 mb-4 flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    <span>Bedrooms & Bathrooms</span>
                                </h5>
                                <ul className="space-y-2 text-gray-700">
                                    {[
                                        'Bedroom A.jpg',
                                        'Bedroom B.jpg',
                                        'Bedroom C.jpg',
                                        'Bathroom A.jpg',
                                        'Bathroom B.jpg',
                                        'Bathroom C.jpg',
                                    ].map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-center space-x-2"
                                        >
                                            <ImageIcon className="h-4 w-4 text-blue-500" />
                                            <span className="font-mono text-sm">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                                <h5 className="font-semibold text-green-800 mb-4 flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                    <span>Living Areas</span>
                                </h5>
                                <ul className="space-y-2 text-gray-700">
                                    {[
                                        'Living Room.jpg',
                                        'Dining (1).jpg',
                                        'Dining (2).jpg',
                                        'Kitchen (1).jpg',
                                        'Kitchen (2).jpg',
                                        'Hallways.jpg',
                                    ].map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-center space-x-2"
                                        >
                                            <ImageIcon className="h-4 w-4 text-green-500" />
                                            <span className="font-mono text-sm">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Second Column */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                                <h5 className="font-semibold text-purple-800 mb-4 flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                                    <span>Additional Rooms</span>
                                </h5>
                                <ul className="space-y-2 text-gray-700">
                                    {[
                                        'Study Room.jpg',
                                        'Maid Room.jpg',
                                        'Storage Room.jpg',
                                        'Laundry Room.jpg',
                                        'Balcony (1).jpg',
                                        'Balcony (2).jpg',
                                    ].map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-center space-x-2"
                                        >
                                            <ImageIcon className="h-4 w-4 text-purple-500" />
                                            <span className="font-mono text-sm">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                                <h5 className="font-semibold text-orange-800 mb-4 flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                                    <span>Common Areas</span>
                                </h5>
                                <ul className="space-y-2 text-gray-700">
                                    {[
                                        'Lobby.jpg',
                                        'Hallway (1).jpg',
                                        'Hallway (2).jpg',
                                        'Common Area (1).jpg',
                                        'Common Area (2).jpg',
                                    ].map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-center space-x-2"
                                        >
                                            <ImageIcon className="h-4 w-4 text-orange-500" />
                                            <span className="font-mono text-sm">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Third Column */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border border-teal-200">
                                <h5 className="font-semibold text-teal-800 mb-4 flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                                    <span>Building Exterior</span>
                                </h5>
                                <ul className="space-y-2 text-gray-700">
                                    {[
                                        'Building Exterior (1).jpg',
                                        'Building Exterior (2).jpg',
                                        'Building Exterior (3).jpg',
                                    ].map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-center space-x-2"
                                        >
                                            <ImageIcon className="h-4 w-4 text-teal-500" />
                                            <span className="font-mono text-sm">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                                <h5 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                                    <Zap className="h-5 w-5 text-yellow-500" />
                                    <span>Pro Tips</span>
                                </h5>
                                <ul className="space-y-2 text-gray-600 text-sm">
                                    <li>
                                        • Use consistent naming for better
                                        organization
                                    </li>
                                    <li>
                                        • Number multiple images of the same
                                        room
                                    </li>
                                    <li>
                                        • Keep file names descriptive but
                                        concise
                                    </li>
                                    <li>
                                        • Use proper capitalization for
                                        readability
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            className="px-6 py-3 text-black bg-gray-200 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                            onClick={() => setIsNamingConventionsOpen(false)}
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

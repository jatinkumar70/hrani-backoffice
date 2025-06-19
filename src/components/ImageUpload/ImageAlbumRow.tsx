'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Move, ImageIcon } from 'lucide-react'
import type { IRoomDetailImages } from '@/redux/child-reducers/property/property.types'
import FileUploaderAsyncV2 from './FileUploaderAsyncV2'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
    index: number
    dataObj: IRoomDetailImages
    albumList: any[]
    handleImageChange: (index: number, key: string, value: any) => void
    moveImagesToAnotherAlbum: (fromIndex: number, toIndex: number, selectedImages: string[]) => void
    asPayload: {
        [key: string]: string | number | null
    }
    expanded: boolean
    onToggle: (index: number) => void
    selectedImages: string[]
    onSelectImage: (filePath: string) => void
    selectedAlbum: string
    onSelectedAlbumChange: (album: string) => void
    onMove: (toAlbumName: string) => void
    onClearSelection: () => void
}

export function ImageAlbumRow({
    index,
    dataObj,
    albumList,
    handleImageChange,
    moveImagesToAnotherAlbum,
    asPayload = {},
    expanded,
    onToggle,
    selectedImages,
    onSelectImage,
    selectedAlbum,
    onSelectedAlbumChange,
    onMove,
    onClearSelection,
}: Props) {
    const handleToggle = () => {
        onToggle(index)
    }

    const imageCount = dataObj.paths?.length || 0

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div
                onClick={handleToggle}
                className="flex flex-col items-center justify-center w-full p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
            >
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 shadow-sm">
                        <ImageIcon size={24} />
                    </div>
                    <div className="text-center">
                        <h3 className="font-semibold text-gray-900 text-lg">
                            {dataObj.album_name || 'Album Name'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {imageCount} {imageCount === 1 ? 'image' : 'images'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3 mt-4">
                    {selectedImages.length > 0 && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full shadow-sm">
                            {selectedImages.length} selected
                        </span>
                    )}
                    <button
                        type="button"
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors duration-200"
                        aria-label={expanded ? "Collapse album" : "Expand album"}
                    >
                        {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                </div>
            </div>
        </div>
    )
}

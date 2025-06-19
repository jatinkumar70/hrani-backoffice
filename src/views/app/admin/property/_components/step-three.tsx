import { Label } from '@/components/ui/Label/label'
import { IProperty } from '@/redux/child-reducers/property'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { useState, useEffect } from 'react'
import { HiPlus, HiMinus } from 'react-icons/hi'

interface Props {
    values: IProperty
    handleChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
    setFieldValue: (label: string, value: any) => void
}

export function PropertyFormStepThree({
    values,
    handleChange,
    setFieldValue,
}: Props) {
    const [videoUrls, setVideoUrls] = useState<Array<{ url: string }>>([
        { url: values.yt_walkthrough_video?.[0] || '' },
    ])

    const [floorPlans, setFloorPlans] = useState<Array<{ plan: string }>>([
        { plan: values.floor_plan?.[0] || '' },
    ])

    useEffect(() => {
        // Sync videoUrls with form values
        const videoUrlArray = videoUrls
            .map((item) => item.url)
            .filter((url) => url !== '')
        setFieldValue('yt_walkthrough_video', videoUrlArray)
    }, [videoUrls, setFieldValue])

    useEffect(() => {
        // Sync floorPlans with form values
        const floorPlanArray = floorPlans
            .map((item) => item.plan)
            .filter((plan) => plan !== '')
        setFieldValue('floor_plan', floorPlanArray)
    }, [floorPlans, setFieldValue])

    return (
        <div className="space-y-4 w-10/12 md:w-full ">
            {/* YouTube Walkthrough Video Section */}
            <div className=" rounded-xl shadow-xl p-6 mb-6 sm:p-6  mb-6 ">
                <label className="block mb-4 text-gray-800 text-lg font-semibold">
                    YouTube Walkthrough Video
                </label>
                <div className="flex  gap-4 justify-between ">
                    <div className="flex-1">
                        {videoUrls.map((item, index) => (
                            <div
                                key={index}
                                className="flex gap-4 items-center mb-4 "
                            >
                                <div className="md:w-full w-5/12">
                                    <label className="block mb-1 text-gray-800 text-sm font-medium">
                                        YouTube Walkthrough Video {index + 1}
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full bg-transparent px-3 text-gray-600 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={item.url}
                                        onChange={(e) => {
                                            const newUrls = [...videoUrls]
                                            newUrls[index].url = e.target.value
                                            setVideoUrls(newUrls)
                                        }}
                                    />
                                </div>
                                <div className="flex items-end gap-2 mt-6">
                                    {videoUrls.length > 1 && (
                                        <button
                                            type="button"
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => {
                                                const newUrls =
                                                    videoUrls.filter(
                                                        (_, i) => i !== index,
                                                    )
                                                setVideoUrls(newUrls)
                                            }}
                                        >
                                            <HiMinus className="h-5 w-5" />
                                        </button>
                                    )}
                                    {index === videoUrls.length - 1 && (
                                        <button
                                            type="button"
                                            className="text-primary hover:text-primary-dark"
                                            onClick={() =>
                                                setVideoUrls([
                                                    ...videoUrls,
                                                    { url: '' },
                                                ])
                                            }
                                        >
                                            <HiPlus className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Floor plans Section */}
            <div className="w-full rounded-xl shadow-xl p-6 mb-6">
                <label className="block mb-4 text-gray-800 text-lg font-semibold">
                    Floor plans
                </label>
                <div className="flex w-full gap-4 justify-between">
                    <div className="flex-1">
                        {floorPlans.map((item, index) => (
                            <div
                                key={index}
                                className="flex gap-4 items-center mb-4"
                            >
                                <div className="w-10/12">
                                    <label className="block mb-1 text-sm font-medium">
                                        Floor Plan {index + 1}
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border bg-transparent border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={item.plan}
                                        onChange={(e) => {
                                            const newPlans = [...floorPlans]
                                            newPlans[index].plan =
                                                e.target.value
                                            setFloorPlans(newPlans)
                                        }}
                                    />
                                </div>
                                <div className="flex items-end gap-2 mt-6">
                                    {floorPlans.length > 1 && (
                                        <button
                                            type="button"
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => {
                                                const newPlans =
                                                    floorPlans.filter(
                                                        (_, i) => i !== index,
                                                    )
                                                setFloorPlans(newPlans)
                                            }}
                                        >
                                            <HiMinus className="h-5 w-5" />
                                        </button>
                                    )}
                                    {index === floorPlans.length - 1 && (
                                        <button
                                            type="button"
                                            className="text-primary hover:text-primary-dark"
                                            onClick={() =>
                                                setFloorPlans([
                                                    ...floorPlans,
                                                    { plan: '' },
                                                ])
                                            }
                                        >
                                            <HiPlus className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <Label
                    htmlFor="about_property"
                    className="mb-6 text-gray-800 block"
                >
                    About Property
                </Label>
                <RichTextEditor
                    content={values.about_property}
                    onChange={({ html }) => {
                        handleChange({
                            target: {
                                name: 'about_property',
                                value: html,
                            } as any,
                        } as React.ChangeEvent<HTMLTextAreaElement>)
                    }}
                    editorContentClass="min-h-32 w-full"
                    placeholder="Enter a detailed description of the property"
                />
            </div>
        </div>
    )
}

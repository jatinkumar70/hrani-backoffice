"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  Plus,
  Trash2,
  MapPin,
  Bus,
  Plane,
  ShoppingBag,
  Waves,
  Flag,
  ShoppingCart,
  Utensils,
  Landmark,
  Save,
  X,
  Edit,
  ChevronLeft,
  ChevronRight,
  Navigation,
} from "lucide-react"
import type { IProperty } from "@/redux/child-reducers/property"
import { api } from "@/utils/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs/Tabs"
import { Button, Card, Input } from "@/components/ui"
import { Label } from "@/components/ui/Label/label"
import toast from "@/components/ui/toast/toast"

interface Props {
  setFieldValue: any
  values: IProperty
  handleChange: any
}

interface LocationDetail {
  location: string
  radius: string
}

interface NearbyLocation {
  category: string
  locations: LocationDetail[]
  showFields: boolean
  isEditing: boolean
  property_nearby_uuid: string | null
}

interface NearbyPlace {
  location: string
  distance: string
}

interface PropertyNearbyResponse {
  property_nearby_uuid: string
  nearby_type: string
  nearby_places: NearbyPlace[]
}

const NEARBY_CATEGORIES = [
  "Attractions",
  "Restaurants and cafes",
  "Supermarkets",
  "Golf courses",
  "Beaches",
  "Shopping malls",
  "Airports",
  "Public transport",
]

const categoryIcons: Record<string, React.ReactNode> = {
  Attractions: <Landmark className="h-4 w-4" />,
  "Restaurants and cafes": <Utensils className="h-4 w-4" />,
  Supermarkets: <ShoppingCart className="h-4 w-4" />,
  "Golf courses": <Flag className="h-4 w-4" />,
  Beaches: <Waves className="h-4 w-4" />,
  "Shopping malls": <ShoppingBag className="h-4 w-4" />,
  Airports: <Plane className="h-4 w-4" />,
  "Public transport": <Bus className="h-4 w-4" />,
}

export function PropertyFormStepEleven({ setFieldValue, handleChange, values }: Props) {
  const [nearbyLocations, setNearbyLocations] = useState<NearbyLocation[]>(
    NEARBY_CATEGORIES.map((category) => ({
      category,
      locations: [],
      showFields: false,
      isEditing: false,
      property_nearby_uuid: null,
    })),
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>(NEARBY_CATEGORIES[0])
  const tabsRef = useRef<HTMLDivElement>(null)
  const [showLeftScroll, setShowLeftScroll] = useState(false)
  const [showRightScroll, setShowRightScroll] = useState(false)
  const [locationSuggestions, setLocationSuggestions] = useState<Array<{ vicinity: string; distance_km: string }>>([])
  const [activeLocationIndex, setActiveLocationIndex] = useState<number | null>(null)

  const checkScroll = () => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current
      setShowLeftScroll(scrollLeft > 0)
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 5)
    }
  }

  const fetchLocationSuggestions = async (category: string) => {
    if (!values.property_details_uuid) return

    setIsFetchingSuggestions(true)
    try {
      // Map category to the correct type parameter
      let type = ""
      switch (category) {
        case "Attractions":
          type = "amusement_park"
          break
        case "Restaurants and cafes":
          type = "restaurant"
          break
        case "Supermarkets":
          type = "supermarket"
          break
        case "Golf courses":
          type = "stadium"
          break
        case "Beaches":
          type = "beach"
          break
        case "Shopping malls":
          type = "shopping_mall"
          break
        case "Airports":
          type = "airport"
          break
        case "Public transport":
          type = "taxi_stand"
          break
        default:
          type = ""
      }

      // Skip if no type mapping is available
      if (!type) return

      const response = await api.get(
        `/google/get-google-by-property?property_details_uuid=${values.property_details_uuid}&type=${type}&radius=15000`,
      )

      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        const suggestions = response.data.data.map((item: any) => ({
          vicinity: item.vicinity || "",
          distance_km: item.distance_km ? `${item.distance_km} km` : "",
        }))
        setLocationSuggestions(suggestions)
      }
    } catch (error) {
      console.error("Error fetching location suggestions:", error)
      setLocationSuggestions([])
    } finally {
      setIsFetchingSuggestions(false)
    }
  }

  const scroll = (direction: "left" | "right") => {
    if (tabsRef.current) {
      const scrollAmount = 200
      tabsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    const tabsElement = tabsRef.current
    if (tabsElement) {
      checkScroll()
      tabsElement.addEventListener("scroll", checkScroll)
      window.addEventListener("resize", checkScroll)

      return () => {
        tabsElement.removeEventListener("scroll", checkScroll)
        window.removeEventListener("resize", checkScroll)
      }
    }
  }, [])

  // Fetch nearby locations when component mounts
  useEffect(() => {
    const fetchNearbyLocations = async () => {
      if (!values.property_details_uuid) return

      setIsLoading(true)
      try {
        const response = await api.get(
          `/property/get-property-nearby?property_details_uuid=${values.property_details_uuid}`,
        )
        const data = response.data

        if (data && data.data && Array.isArray(data.data)) {
          const updatedLocations = [...nearbyLocations]

          data.data.forEach((item: PropertyNearbyResponse) => {
            const categoryIndex = updatedLocations.findIndex((loc) => loc.category === item.nearby_type)

            if (categoryIndex !== -1 && item.nearby_places && Array.isArray(item.nearby_places)) {
              updatedLocations[categoryIndex].locations = item.nearby_places.map((place: NearbyPlace) => ({
                location: place.location || "",
                radius: place.distance || "",
              }))
              updatedLocations[categoryIndex].property_nearby_uuid = item.property_nearby_uuid || null
              updatedLocations[categoryIndex].showFields = true
            }
          })

          setNearbyLocations(updatedLocations)
          setFieldValue("nearbyLocations", updatedLocations)
        }
      } catch (error) {
        console.error("Error fetching nearby locations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNearbyLocations()
  }, [values.property_details_uuid])

  useEffect(() => {
    fetchLocationSuggestions(activeTab)
  }, [activeTab, values.property_details_uuid])

  const handleEditLocation = (categoryIndex: number) => {
    setNearbyLocations((prev) => {
      const updated = prev.map((category, index) => {
        if (index === categoryIndex) {
          return {
            ...category,
            showFields: true,
            isEditing: true,
            locations: category.locations.length === 0 ? [{ location: "", radius: "" }] : category.locations,
          }
        }
        return category
      })
      return updated
    })
  }

  const handleSaveLocation = async (categoryIndex: number) => {
    const category = nearbyLocations[categoryIndex]
    try {
      if (category.locations.length === 0) {
        console.error("No locations to save")
        return
      }

      const payload = {
        property_nearby_uuid: category.property_nearby_uuid,
        property_details_uuid: values.property_details_uuid,
        property_details_name: values.property_details_name,
        nearby_type: category.category,
        nearby_places: category.locations.map((loc) => ({
          location: loc.location,
          latitude: 0,
          longitude: 0,
          distance: loc.radius,
        })),
        status: category.locations.some((loc) => loc.location && loc.radius) ? "ACTIVE" : "INACTIVE",
      }

      const response = await api.post("/property/upsert-property-nearby", payload)
      if (response.status === 200) {
        toast.push("Nearby locations updated successfully!")
      }

      setNearbyLocations((prev) => {
        const updated = [...prev]
        updated[categoryIndex].isEditing = false
        if (!category.locations.some((loc) => loc.location && loc.radius)) {
          updated[categoryIndex].showFields = false
          updated[categoryIndex].locations = []
        }
        return updated
      })
    } catch (error) {
      console.error("Error saving nearby location:", error)
      toast.push("Failed to update nearby locations")
    }
  }

  const handleCancelEdit = (categoryIndex: number) => {
    setNearbyLocations((prev) => {
      const updated = [...prev]
      updated[categoryIndex].isEditing = false

      // If there were no locations before editing, hide the fields
      if (!prev[categoryIndex].locations.some((loc) => loc.location && loc.radius)) {
        updated[categoryIndex].showFields = false
        updated[categoryIndex].locations = []
      } else {
        // Restore the previous locations
        updated[categoryIndex].locations = [...prev[categoryIndex].locations]
      }

      return updated
    })
  }

  const handleLocationChange = (
    categoryIndex: number,
    locationIndex: number,
    field: "location" | "radius",
    value: string,
  ) => {
    setNearbyLocations((prev) => {
      const updated = [...prev]
      updated[categoryIndex].locations[locationIndex] = {
        ...updated[categoryIndex].locations[locationIndex],
        [field]: value,
      }
      setFieldValue("nearbyLocations", updated)
      return updated
    })
  }

  const handleAddLocation = (categoryIndex: number) => {
    setNearbyLocations((prev) => {
      const updated = prev.map((category, index) => {
        if (index === categoryIndex) {
          return {
            ...category,
            locations: [...category.locations, { location: "", radius: "" }],
          }
        }
        return category
      })
      return updated
    })
  }

  const handleDeleteLocation = (categoryIndex: number, locationIndex: number) => {
    setNearbyLocations((prev) => {
      const updated = [...prev]
      const newLocations = updated[categoryIndex].locations.filter((_, index) => index !== locationIndex)
      updated[categoryIndex] = {
        ...updated[categoryIndex],
        locations: newLocations,
        showFields: newLocations.length > 0,
      }
      setFieldValue("nearbyLocations", updated)
      return updated
    })
  }

  const handleSelectSuggestion = (
    categoryIndex: number,
    locationIndex: number,
    suggestion: { vicinity: string; distance_km: string },
  ) => {
    setNearbyLocations((prev) => {
      const updated = [...prev]
      updated[categoryIndex].locations[locationIndex] = {
        location: suggestion.vicinity,
        radius: suggestion.distance_km,
      }
      setFieldValue("nearbyLocations", updated)
      setActiveLocationIndex(null)
      return updated
    })
  }

  const getCategoryIndex = (category: string) => {
    return NEARBY_CATEGORIES.findIndex((cat) => cat === category)
  }

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div className="border-b border-gray-300 pb-4">
        <h3 className="text-xl font-semibold mb-2">Nearby Places</h3>
        <p className="text-muted-foreground">Add nearby points of interest to help guests discover the neighborhood.</p>
      </div>

      <Tabs defaultValue={NEARBY_CATEGORIES[0]} className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <div className="relative mb-6">
          {showLeftScroll && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-xl rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {showRightScroll && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-xl rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
          <div
            ref={tabsRef}
            className="overflow-x-auto scrollbar-hide mx-8 pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <TabsList className="inline-flex w-auto min-w-full gap-1 p-1 bg-gray-100 dark:bg-gray-800/50">
              {NEARBY_CATEGORIES.map((category) => {
                const categoryIndex = getCategoryIndex(category)
                const hasLocations =
                  nearbyLocations[categoryIndex]?.locations.length > 0 &&
                  nearbyLocations[categoryIndex]?.locations.some((loc) => loc.location && loc.radius)

                return (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className={`flex items-center gap-2 px-4 py-2 whitespace-nowrap relative min-w-[150px] transition-all ${
                      activeTab === category
                        ? "bg-white dark:bg-gray-800 text-primary border-b-2 border-primary font-medium shadow-sm"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {categoryIcons[category] || <MapPin className="h-4 w-4" />}
                    <span>{category}</span>
                    {hasLocations && (
                      <span
                        className={`absolute top-1 right-1 w-2 h-2 ${
                          activeTab === category ? "bg-white" : "bg-green-500"
                        } rounded-full`}
                      />
                    )}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>
        </div>

        {NEARBY_CATEGORIES.map((category, categoryIndex) => (
          <TabsContent key={category} value={category}>
            <Card className="border rounded-lg shadow-sm">
              <Card.Content className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      {categoryIcons[category] || <MapPin className="h-5 w-5" />}
                      <h3 className="text-lg font-medium">{category}</h3>
                    </div>

                    {!nearbyLocations[categoryIndex].isEditing ? (
                      <Button
                        variant="solid"
                        onClick={() => handleEditLocation(categoryIndex)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          onClick={() => handleSaveLocation(categoryIndex)}
                          className="flex items-center gap-2"
                        >
                          <Save className="h-4 w-4" />
                          <span className="hidden sm:inline">Save</span>
                        </Button>
                        <Button
                          variant="plain"
                          onClick={() => handleCancelEdit(categoryIndex)}
                          className="flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          <span className="hidden sm:inline">Cancel</span>
                        </Button>
                      </div>
                    )}
                  </div>

                  {nearbyLocations[categoryIndex].showFields ? (
                    <div className="space-y-6">
                      {nearbyLocations[categoryIndex].locations.map((location, locationIndex) => (
                        <div
                          key={locationIndex}
                          className={`p-4 rounded-lg ${
                            nearbyLocations[categoryIndex].isEditing ? "bg-gray-50 dark:bg-gray-800/50" : ""
                          }`}
                        >
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col md:flex-row gap-4 w-full">
                              <div className="flex-1 space-y-2 w-full">
                                <Label
                                  htmlFor={`location-${categoryIndex}-${locationIndex}`}
                                  className="text-sm font-medium"
                                >
                                  Location Name
                                </Label>
                                <div className="relative w-full">
                                  <Input
                                    id={`location-${categoryIndex}-${locationIndex}`}
                                    placeholder={`Enter ${category.toLowerCase()} name`}
                                    value={location.location}
                                    disabled={!nearbyLocations[categoryIndex].isEditing}
                                    onChange={(e) =>
                                      handleLocationChange(categoryIndex, locationIndex, "location", e.target.value)
                                    }
                                    onFocus={() => setActiveLocationIndex(locationIndex)}
                                    className="w-full"
                                  />
                                </div>
                              </div>
                              <div className="w-full md:w-[180px] space-y-2">
                                <Label
                                  htmlFor={`radius-${categoryIndex}-${locationIndex}`}
                                  className="text-sm font-medium"
                                >
                                  Distance (km)
                                </Label>
                                <Input
                                  id={`radius-${categoryIndex}-${locationIndex}`}
                                  type="number"
                                  placeholder="e.g. 1.5"
                                  value={location.radius.replace(" km", "")}
                                  disabled={!nearbyLocations[categoryIndex].isEditing}
                                  onChange={(e) =>
                                    handleLocationChange(categoryIndex, locationIndex, "radius", `${e.target.value} km`)
                                  }
                                  className="w-full"
                                />
                              </div>
                            </div>

                            {nearbyLocations[categoryIndex].isEditing && (
                              <div className="flex justify-end gap-2 mt-2">
                                {locationIndex === nearbyLocations[categoryIndex].locations.length - 1 && (
                                  <Button
                                    variant="solid"
                                    size="sm"
                                    onClick={() => handleAddLocation(categoryIndex)}
                                    className="flex items-center"
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    <span>Add</span>
                                  </Button>
                                )}
                                {nearbyLocations[categoryIndex].locations.length > 1 && (
                                  <Button
                                    variant="solid"
                                    size="sm"
                                    onClick={() => handleDeleteLocation(categoryIndex, locationIndex)}
                                    className="flex items-center"
                                  >
                                    <Trash2 className="h-4 w-4 mr-1 text-destructive" />
                                    <span>Remove</span>
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Location Suggestions as Chips */}
                          {nearbyLocations[categoryIndex].isEditing &&
                            activeLocationIndex === locationIndex &&
                            !location.location && (
                              <div className="mt-4">
                                <div className="text-sm font-medium text-muted-foreground mb-2">
                                  Suggested locations:
                                </div>
                                {isFetchingSuggestions ? (
                                  <div className="flex items-center justify-center py-4">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                                    <span className="ml-2 text-sm text-muted-foreground">Loading suggestions...</span>
                                  </div>
                                ) : locationSuggestions.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {locationSuggestions.map((suggestion, idx) => (
                                      <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleSelectSuggestion(categoryIndex, locationIndex, suggestion)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-sm rounded-full transition-colors group"
                                      >
                                        <Navigation className="h-3 w-3 text-primary" />
                                        <span className="truncate max-w-[200px]">{suggestion.vicinity}</span>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                          {suggestion.distance_km}
                                        </span>
                                        <span className="ml-1 text-xs text-primary opacity-0 group-hover:opacity-100">
                                          Add
                                        </span>
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-muted-foreground py-2">
                                    No suggestions available for this category.
                                  </p>
                                )}
                              </div>
                            )}
                        </div>
                      ))}

                      {nearbyLocations[categoryIndex].isEditing &&
                        nearbyLocations[categoryIndex].locations.length === 0 && (
                          <Button
                            variant="default"
                            className="w-full py-6 border-dashed"
                            onClick={() => handleAddLocation(categoryIndex)}
                          >
                            <Plus className="h-5 w-5 mr-2" />
                            Add {category.toLowerCase()}
                          </Button>
                        )}
                    </div>
                  ) : (
                    <div className="py-12 text-center bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                      <MapPin className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                      <p className="text-muted-foreground mb-4">No {category.toLowerCase()} added yet</p>
                      <Button
                        variant="default"
                        onClick={() => handleEditLocation(categoryIndex)}
                        className="mx-auto flex items-center min-w-[120px]"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add {category.toLowerCase()}
                      </Button>
                    </div>
                  )}

                  {!nearbyLocations[categoryIndex].isEditing && nearbyLocations[categoryIndex].showFields && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        {nearbyLocations[categoryIndex].locations.length}{" "}
                        {nearbyLocations[categoryIndex].locations.length === 1 ? "location" : "locations"} added
                      </p>
                    </div>
                  )}
                </div>
              </Card.Content>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  )
}

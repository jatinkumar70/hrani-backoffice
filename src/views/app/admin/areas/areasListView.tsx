import { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, Table } from '@/components/ui'
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { Button } from '@/components/ui'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { apiGetPropertyAreas } from '@/services/PropertyService'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Switcher from '@/components/ui/Switcher'
import { Label } from '@/components/ui/Label/label'
import { Input } from '@/components/ui'
import { api } from '@/utils/api'
import axios_base_api from '@/api/axios-base-api'
import { CheckCircle, XCircle, BarChart3 } from 'lucide-react'

const { Tr, Th, Td, THead, TBody } = Table

interface Area {
    locations_unique_id: number
    locations_uuid: string
    location_name: string
    city: string
    status: string
    created_by_uuid: string | null
    created_by_name: string | null
    modified_by_uuid: string | null
    modified_by_name: string | null
    create_ts: string
    insert_ts: string
}

// Types
interface StatusCount {
    status: string
    count: number
}

const AreasListView = () => {
    const [areas, setAreas] = useState<Area[]>([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [newAreaName, setNewAreaName] = useState("")
    const [newAreaCity, setNewAreaCity] = useState("")
    const [isAreaActive, setIsAreaActive] = useState(true)
    const [selectedArea, setSelectedArea] = useState<Area | null>(null)

    // Calculate status counts from areas data
    const statusCounts = useMemo(() => {
        const counts: { [key: string]: number } = {}

        areas.forEach((area) => {
            const status = area.status || 'unknown'
            counts[status] = (counts[status] || 0) + 1
        })

        return Object.entries(counts).map(([status, count]) => ({
            status,
            count,
        }))
    }, [areas])

    const fetchAreas = async () => {
        try {
            setLoading(true)
            const response = await apiGetPropertyAreas()
            if (response.data && Array.isArray(response.data)) {
                setAreas(response.data)
            } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
                setAreas(response.data.data)
            } else {
                setAreas([])
            }
        } catch (error) {
            console.error('Error fetching areas:', error)
            setAreas([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAreas()
    }, [])

    const handleAreaCreation = async () => {
        try {
            const response = await api.post("/property/upsert-property-area", {
                locations_uuid: null,
                location_name: newAreaName,
                city: newAreaCity,
                status: isAreaActive ? "ACTIVE" : "INACTIVE"
            });

            if (response.data) {
                await fetchAreas();
                setNewAreaName("");
                setNewAreaCity("");
                setIsAreaActive(true);
            }
        } catch (error) {
            console.error("Error creating new area:", error);
        } finally {
            setIsConfirmDialogOpen(false);
        }
    };

    const handleAreaEdit = async () => {
        if (!selectedArea) return;

        try {
            const response = await api.post("/property/upsert-property-area", {
                locations_uuid: selectedArea.locations_uuid,
                location_name: newAreaName,
                city: newAreaCity,
                status: isAreaActive ? "ACTIVE" : "INACTIVE"
            });

            if (response.data) {
                await fetchAreas();
                resetForm();
            }
        } catch (error) {
            console.error("Error updating area:", error);
        } finally {
            setIsEditDialogOpen(false);
        }
    };

    const resetForm = () => {
        setNewAreaName("");
        setNewAreaCity("");
        setIsAreaActive(true);
        setSelectedArea(null);
    };

    const onEdit = (area: Area) => {
        setSelectedArea(area);
        setNewAreaName(area.location_name);
        setNewAreaCity(area.city);
        setIsAreaActive(area.status === "ACTIVE");
        setIsEditDialogOpen(true);
    }

    const onDelete = (area: Area) => {
        // Handle delete functionality
        console.log('Delete area:', area)
    }

    // Status Dashboard Component
    const StatusDashboard = () => {
        const getStatusIcon = (status: string) => {
            switch (status.toLowerCase()) {
                case 'active':
                    return <CheckCircle className="w-5 h-5 text-green-600" />
                case 'inactive':
                    return <XCircle className="w-5 h-5 text-red-600" />
                default:
                    return <BarChart3 className="w-5 h-5 text-gray-600" />
            }
        }

        const getStatusColor = (status: string) => {
            switch (status.toLowerCase()) {
                case 'active':
                    return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30'
                case 'inactive':
                    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30'
                default:
                    return 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
            }
        }

        const totalDisplayedCount = statusCounts.reduce((sum, item) => sum + item.count, 0)
        const totalAreas = areas.length

        if (loading) {
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
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {[...Array(3)].map((_, i) => (
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
                            {totalAreas?.toLocaleString()} Total
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {totalDisplayedCount.toLocaleString()} Displayed
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {statusCounts.map((item) => (
                        <div
                            key={item.status}
                            className={`
                                ${getStatusColor(item.status)}
                                p-3 rounded-md border transition-all duration-200 
                                hover:shadow-sm cursor-pointer
                            `}
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
                                {totalDisplayedCount > 0 ? ((item.count / totalDisplayedCount) * 100).toFixed(1) : 0}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div>

            {/* Status Dashboard */}
            <Card>
                <div className="lg:flex items-center justify-between mb-4">
                    <h3>{t('Property Areas')}</h3>
                    <div className="flex flex-col md:flex-row gap-2">
                        <Button
                            variant="solid"
                            onClick={() => {
                                resetForm();
                                setIsConfirmDialogOpen(true);
                            }}
                        >
                            {t('Add Area')}
                        </Button>
                    </div>
                </div>
                <StatusDashboard />
                <Table>
                    <THead>
                        <Tr>
                            <Th>{t('Area Name')}</Th>
                            <Th>{t('City')}</Th>
                            <Th>{t('Status')}</Th>
                            <Th>{t('Created At')}</Th>
                            <Th>{t('Actions')}</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        {loading ? (
                            <Tr>
                                <Td colSpan={5} className="text-center">
                                    {t('Loading...')}
                                </Td>
                            </Tr>
                        ) : areas.length === 0 ? (
                            <Tr>
                                <Td colSpan={5} className="text-center">
                                    {t('No areas found')}
                                </Td>
                            </Tr>
                        ) : (
                            areas.map((area) => (
                                <Tr key={area.locations_uuid}>
                                    <Td>{area.location_name}</Td>
                                    <Td>{area.city}</Td>
                                    <Td>
                                        <span className={`px-2 py-1 rounded-full text-xs ${area.status === 'ACTIVE'
                                            ? 'bg-emerald-100 text-emerald-600'
                                            : 'bg-red-100 text-red-600'
                                            }`}>
                                            {area.status}
                                        </span>
                                    </Td>
                                    <Td>{new Date(area.create_ts).toLocaleDateString()}</Td>
                                    <Td>
                                        <div className="flex gap-2">
                                            <Button
                                                icon={<HiOutlinePencil />}
                                                size="sm"
                                                variant="plain"
                                                onClick={() => onEdit(area)}
                                            />
                                            <Button
                                                icon={<HiOutlineTrash />}
                                                size="sm"
                                                variant="plain"
                                                onClick={() => onDelete(area)}
                                            />
                                        </div>
                                    </Td>
                                </Tr>
                            ))
                        )}
                    </TBody>
                </Table>
            </Card>

            {/* Create Area Dialog */}
            <ConfirmDialog
                isOpen={isConfirmDialogOpen}
                type="info"
                title={t('Add New Area')}
                onClose={() => {
                    setIsConfirmDialogOpen(false);
                    resetForm();
                }}
                onRequestClose={() => {
                    setIsConfirmDialogOpen(false);
                    resetForm();
                }}
                onCancel={() => {
                    setIsConfirmDialogOpen(false);
                    resetForm();
                }}
                onConfirm={handleAreaCreation}
                confirmText={t('Create Area')}
                cancelText={t('Cancel')}
                confirmButtonProps={{
                    variant: 'solid',
                    className: 'bg-primary-500 hover:bg-primary-600 text-black'
                }}
                cancelButtonProps={{
                    variant: 'plain'
                }}
            >
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="areaName" className="mb-2 block text-gray-700 dark:text-gray-200 font-medium">
                            {t('Area Name')}
                        </Label>
                        <Input
                            id="areaName"
                            value={newAreaName}
                            onChange={(e) => setNewAreaName(e.target.value)}
                            placeholder={t('Enter area name')}
                            className="w-full"
                            autoFocus
                        />
                    </div>
                    <div>
                        <Label htmlFor="areaCity" className="mb-2 block text-gray-700 dark:text-gray-200 font-medium">
                            {t('City')}
                        </Label>
                        <Input
                            id="areaCity"
                            value={newAreaCity}
                            onChange={(e) => setNewAreaCity(e.target.value)}
                            placeholder={t('Enter city name')}
                            className="w-full"
                        />
                    </div>
                    {/* <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex flex-col">
                            <span className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                                {t('Status')}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {t('Set whether this area should be active or inactive')}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switcher
                                checked={isAreaActive}
                                onChange={(checked: boolean) => setIsAreaActive(checked)}
                                switcherClass={isAreaActive ? "bg-emerald-500" : "bg-gray-400"}
                            />
                            <Label className="text-gray-700 dark:text-gray-200">
                                {isAreaActive ? t('Active') : t('Inactive')}
                            </Label>
                        </div>
                    </div> */}
                    {(!newAreaName.trim() || !newAreaCity.trim()) && (
                        <div className="text-amber-500 text-sm">
                            {t('Please enter both area name and city to continue')}
                        </div>
                    )}
                </div>
            </ConfirmDialog>

            {/* Edit Area Dialog */}
            <ConfirmDialog
                isOpen={isEditDialogOpen}
                type="info"
                title={t('Edit Area')}
                onClose={() => {
                    setIsEditDialogOpen(false);
                    resetForm();
                }}
                onRequestClose={() => {
                    setIsEditDialogOpen(false);
                    resetForm();
                }}
                onCancel={() => {
                    setIsEditDialogOpen(false);
                    resetForm();
                }}
                onConfirm={handleAreaEdit}
                confirmText={t('Update Area')}
                cancelText={t('Cancel')}
                confirmButtonProps={{
                    variant: 'solid',
                    className: 'bg-primary-500 hover:bg-primary-600 text-black'
                }}
                cancelButtonProps={{
                    variant: 'plain'
                }}
            >
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="editAreaName" className="mb-2 block text-gray-700 dark:text-gray-200 font-medium">
                            {t('Area Name')}
                        </Label>
                        <Input
                            id="editAreaName"
                            value={newAreaName}
                            onChange={(e) => setNewAreaName(e.target.value)}
                            placeholder={t('Enter area name')}
                            className="w-full"
                            autoFocus
                        />
                    </div>
                    <div>
                        <Label htmlFor="editAreaCity" className="mb-2 block text-gray-700 dark:text-gray-200 font-medium">
                            {t('City')}
                        </Label>
                        <Input
                            id="editAreaCity"
                            value={newAreaCity}
                            onChange={(e) => setNewAreaCity(e.target.value)}
                            placeholder={t('Enter city name')}
                            className="w-full"
                        />
                    </div>
                    {/* <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex flex-col">
                            <span className="text-gray-700 dark:text-gray-200 font-medium mb-1">
                                {t('Status')}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {t('Set whether this area should be active or inactive')}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switcher
                                checked={isAreaActive}
                                onChange={(checked: boolean) => setIsAreaActive(checked)}
                                switcherClass={isAreaActive ? "bg-emerald-500" : "bg-gray-400"}
                            />
                            <Label className="text-gray-700 dark:text-gray-200">
                                {isAreaActive ? t('Active') : t('Inactive')}
                            </Label>
                        </div>
                    </div> */}
                    {(!newAreaName.trim() || !newAreaCity.trim()) && (
                        <div className="text-amber-500 text-sm">
                            {t('Please enter both area name and city to continue')}
                        </div>
                    )}
                </div>
            </ConfirmDialog>
        </div>
    )
}

export default AreasListView 
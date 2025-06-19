import { server_base_endpoints } from '@/api'
import axios_base_api from '@/api/axios-base-api'

export const apiGetPropertyAreas = () => {
    return axios_base_api.get(server_base_endpoints.property.get_property_areas)
} 
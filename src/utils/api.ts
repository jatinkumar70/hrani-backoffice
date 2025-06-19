import axios from 'axios'

// In Vite, environment variables are accessed via import.meta.env instead of process.env
export const apiBaseurl =
    import.meta.env.VITE_SERVER_BASE_URL ||
    'https://bnbmetestapi.bnbmehomes.in/api/v1/'
export const apiFrontendUrl =
    import.meta.env.VITE_FRONTEND_API || 'https://www.bnbmehomes.com'

export const api = axios.create({
    baseURL: apiBaseurl,
})

api.interceptors.request.use(
    (config) => {
        const token = getTokenFromCookies()
        if (token) {
            config.headers['auth-Token'] = `${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

//################################ server_base_api ##########################################
import { GLOBAL_CONFIG } from '../global-configuration'
import {
    clearUserSessionFromLocalStore,
    getTokenFromCookies,
} from './axios-api.helpers'

export const server_base_api = axios.create({
    baseURL: GLOBAL_CONFIG.server_base_url,
})

server_base_api.interceptors.request.use((config) => {
    const accessToken = getTokenFromCookies()
    if (accessToken && config.headers) {
        // Use standard Authorization header with Bearer prefix
        config.headers['Authorization'] = `Bearer ${accessToken}`
        // Keep the auth-Token header for backward compatibility
        config.headers['auth-Token'] = accessToken
    }
    return config
})

server_base_api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Don't handle 401 for upload-files endpoint
        if (error.response && error.response.status === 401) {
            const isUploadEndpoint = error.config.url?.includes(
                '/general/upload-files',
            )
            if (!isUploadEndpoint) {
                clearUserSessionFromLocalStore()
                window.alert(
                    'Attention: Your session has expired. Please log in again to continue accessing the system. Thank you!',
                )
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    },
)

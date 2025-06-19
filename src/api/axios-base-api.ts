import axios, { AxiosError } from 'axios'

// eslint-disable-next-line import/no-cycle
import { vite_app_routes } from '@/router/vite-app-routes'
import { clearUserSession } from '@/contexts/auth-context/auth-context.utils'
import { GLOBAL_CONFIG } from '@/global-configuration'

// ----------------------------------------------------------------------

const axios_base_api = axios.create({ baseURL: GLOBAL_CONFIG.server_base_url })

axios_base_api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            clearUserSession()
            window.location.href = vite_app_routes.auth.sign_in
        }
        return Promise.reject(
            (error.response && error.response.data) || 'Something went wrong!',
        )
    },
)

export default axios_base_api

// ----------------------------------------------------------------------

export const consoleAxiosErrors = (error: Error) => {
    if (axios.isAxiosError(error)) {
        console.error('Axios error occurred:', error.message)
        if (error.response) {
            console.error('Axios error Response status:', error.response.status)
            console.error('Axios error Response data:', error.response.data)
        } else if (error.request) {
            console.error('Axios error No response received:', error.request)
        } else {
            console.error(
                'Axios error Request configuration error:',
                error.message,
            )
        }
    } else {
        console.error('Non-Axios error occurred:', error)
    }
}

export const axios_Loading_messages = {
    save: 'Saving your changes...!',
    save_success: 'Data Saved Successfully...!',
    save_error: 'Error occurred while saving changes...!',
    upload: 'Uploading files...!',
}

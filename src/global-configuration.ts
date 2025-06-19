

interface IGlobalConfiguration {
    server_base_url: string
}


export const GLOBAL_CONFIG: IGlobalConfiguration = {
    server_base_url: import.meta.env.VITE_SERVER_BASE_URL ?? '',
}
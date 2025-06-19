import axios_base_api from "@/api/axios-base-api";
import { IUserProfile } from "@/redux";

export const TOKEN_STORAGE_KEY = 'jwt_access_token';
export const AUTH_STORAGE_KEY = 'auth_user';
export const AUTH_HEADER_KEY = "auth-Token";

interface IDecodedJWTToken {
    user_fact_unique_id: number,
    user_uuid: string,
    email: string,
    role_uuid: string,
    role_value: string,
    branch_uuid: [],
    iat: number,
    exp: number
}

function base64DecodeUnicode(str: string): string {
    return decodeURIComponent(atob(str).split('').map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join(''));
}
export function decodeJWTToken(token: string): IDecodedJWTToken | null {
    try {
        if (!token) return null;

        const parts = token.split('.');
        if (parts.length !== 3) throw new Error('Invalid token structure');

        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = base64DecodeUnicode(base64);

        return JSON.parse(payload);
    } catch (error) {
        console.error('Error decoding token:', error);
        throw error;
    }
}

export function isTokenExpired(decodedToken: IDecodedJWTToken): boolean {
    if (!decodedToken?.exp) return true;
    return Date.now() >= decodedToken.exp * 1000;
}



export const isValidAccessToken = () => {
    const token = getAccessTokenFromStorage();
    if (!token) return null;
    const decodedToken = decodeJWTToken(token)
    setSession(token)
    return decodedToken && !isTokenExpired(decodedToken) ? decodedToken : null
}

export const setSession = (accessToken: string | null) => {
    try {
        if (accessToken) {
            sessionStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
            axios_base_api.defaults.headers.common[AUTH_HEADER_KEY] = `${accessToken}`;

            // const decodedToken: any = jwtDecode(accessToken);

            // if (decodedToken && typeof decodedToken === "object" && "exp" in decodedToken && typeof decodedToken.exp === "number") {
            //     tokenExpired(decodedToken.exp);
            // } else {
            //     throw new Error("Invalid access token!");
            // }
        } else {
            sessionStorage.removeItem(TOKEN_STORAGE_KEY);
            delete axios_base_api.defaults.headers.common[AUTH_HEADER_KEY];
        }
    } catch (error) {
        console.error("Error during set session:", error);
        throw error;
    }
}


export const saveAuthUserIntoStorage = (authInfo: IUserProfile) => localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authInfo));



export const getAccessTokenFromStorage = () => sessionStorage.getItem(TOKEN_STORAGE_KEY);

export const getAuthUserFromStorage = (): IUserProfile | null => {
    const user_info = localStorage.getItem(AUTH_STORAGE_KEY);
    if (user_info) {
        return JSON.parse(user_info)
    }
    return null
}


export const clearUserSession = () => {
    delete axios_base_api.defaults.headers.common.Authorization;
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
}
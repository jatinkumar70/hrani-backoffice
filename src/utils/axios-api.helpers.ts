import { TOKEN_STORAGE_KEY } from '@/contexts/auth-context/auth-context.utils';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';


export const setTokenInCookies = (access_token: string) => {
    Cookies?.set("token", access_token)
};

export const getTokenFromCookies = () => {
    // First try to get token from cookies
    const cookieToken = Cookies?.get('token');
    if (cookieToken) return cookieToken;

    // If not found in cookies, try sessionStorage
    return sessionStorage.getItem(TOKEN_STORAGE_KEY);
};

export const removeTokenFromCookies = () => {
    Cookies?.remove("token");
};


export const getAuthTokenFromLocalStore = (): string | null => {
    const auth = localStorage.getItem("auth");
    if (auth) {
        return JSON.parse(auth).token;
    }
    return null;
};


export const clearUserSessionFromLocalStore = () => {
    removeTokenFromCookies()
    // Perform any necessary cleanup tasks, e.g., clearing local storage
    localStorage.clear();
    // Redirect to the login page or perform any other required action
    // window.alert(
    //   "Attention: Your session has expired. Please log in again to continue accessing the system. Thank you!",
    // );
    // window.location.href = "/login"; // Replace with your desired logout destination
};



export const axiosConsoleError = (error: AxiosError) => {
    if (axios.isAxiosError(error)) {
        console.error("Axios error occurred:", error.request);
        console.error("Axios error occurred:", error.message);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", error.response.data);
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error("Request configuration error:", error.message);
        }
    } else {
        console.error("Non-Axios error occurred:", error);
    }
}
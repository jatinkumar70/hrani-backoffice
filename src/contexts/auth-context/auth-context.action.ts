import axios_base_api from "@/api/axios-base-api";
import { server_base_endpoints } from "@/api/server-base-endpoints";
import { saveAuthUserIntoStorage, setSession } from "./auth-context.utils";
import { IUserProfile } from "@/redux";
import { useNavigate } from "react-router-dom";

export type SignInParams = {
  email: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const signInWithEmailAsync = async ({ email, password }: SignInParams, navigate: ReturnType<typeof useNavigate>): Promise<IUserProfile> => {
  try {
    const res = await axios_base_api.post(server_base_endpoints.auth.sign_in, { emailOrUsername: email, password });

    const { token: accessToken, user } = res.data.data;
    if (!accessToken) throw new Error('Access token not found in response');
    setSession(accessToken);

    if (accessToken) {
      navigate("/app/dashboard/ecommerce");
    }
    return user; // ✅ Return user profile as promised
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

export const fetchAuthUserProfileAsync = (user_uuid: string) => new Promise<IUserProfile>((resolve, reject) => {
  axios_base_api.get(`/user/get-user?status=ACTIVE&user_uuid=${user_uuid}`)
    .then(response => {
      resolve(response.data.data[0])
    })
    .catch(error => {
      reject(error)
    });
})
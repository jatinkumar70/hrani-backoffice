import React, { useContext } from "react";
import { ISecurityGroup, IUserProfile } from "@/redux";

export interface IAuthContext {
    is_loggedIn: boolean;
    user_uuid: string
    user_full_name: string;
    user_info: IUserProfile | null;
    user_role: string | null
    signInWithEmailSuccess: (user: IUserProfile) => void
    userAccessibleModules: ISecurityGroup[]
}
export const defaultAuthContext: IAuthContext = {
    is_loggedIn: false,
    user_uuid: "",
    user_full_name: "",
    user_info: null,
    user_role: "",
    signInWithEmailSuccess: () => { },
    userAccessibleModules: []
}

export const AuthContext = React.createContext<IAuthContext>(defaultAuthContext);


export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuthContext: Context must be used inside AuthProvider');
    return context;
}
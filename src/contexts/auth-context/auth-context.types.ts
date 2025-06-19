export enum UserRoles {
    ADMIN = "ADMIN",
    NONE = "NONE",
    SUPERADMIN = "SUPERADMIN"
}

export interface IUser {
    name: string;
    userId: number;
    email: string;
    isLogin: boolean;
    role: keyof typeof UserRoles;
    tokens: { access: string } | null;
    userUuid: string;
}

export interface ITwoFactorData {
    userFactId: string;
}

export interface IAuthContext {
    user: IUser;
    twoFactorData: ITwoFactorData;
    login: (
        email: string,
        password: string,
        onSuccess: (isOTPPreview: boolean) => void,
        onError: (message: string) => void
    ) => void;
    resendOTP: () => void;
    verifyOTP: (
        otp: string,
        onSuccess: () => void,
        onError: (message: string) => void
    ) => void;
    forgotPassword: (
        email: string,
        otp_for: string,
        onSuccess: () => void,
        onError: (message: string) => void
    ) => void;
    setNewPassword: (
        email: string,
        otp: string,
        new_password: string,
        onSuccess: () => void,
        onError: (message: string) => void
    ) => void;
    logout: () => void;
    addUserName: (name: string) => void;
} 
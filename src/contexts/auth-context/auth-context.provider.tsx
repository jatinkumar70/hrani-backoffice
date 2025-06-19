import { useMemo, useEffect, useCallback, useState } from 'react';
import { isValidAccessToken } from './auth-context.utils';
import { fetchAuthUserProfileAsync } from './auth-context.action';
import { IUserProfile } from '@/redux';
import { AuthContext, defaultAuthContext, IAuthContext } from './auth-context.context';
import Loading from '@/components/shared/Loading';

/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */

type Props = {
    children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
    const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
    const [authLoading, setAuthLoading] = useState<boolean>(true); // Start with loading true
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    const checkUserSession = useCallback(async () => {
        try {
            const accessToken = isValidAccessToken();
            if (accessToken) {
                const userInfo = await fetchAuthUserProfileAsync(accessToken.user_uuid);
                setUserProfile(userInfo);
            } else {
                setUserProfile(null);
            }
        } catch (error) {
            console.error('Error checking user session:', error);
            setUserProfile(null);
        } finally {
            setAuthLoading(false);
            setIsInitialized(true);
        }
    }, []);

    useEffect(() => {
        checkUserSession();
    }, []);

    const memoizedValue: IAuthContext = useMemo(() => {
        if (!userProfile) return defaultAuthContext;
        return {
            user_uuid: userProfile.user_uuid,
            user_full_name: (`${userProfile.first_name} ${userProfile.last_name || ""}`).trim(),
            is_loggedIn: !!userProfile,
            user_role: userProfile.role_value,
            user_info: userProfile,
            signInWithEmailSuccess: (user) => setUserProfile(user),
            userAccessibleModules: userProfile.module_security || []
        };
    }, [userProfile]);

    // Show loading only during initial auth check
    if (!isInitialized) {
        return <Loading loading />;
    }

    return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

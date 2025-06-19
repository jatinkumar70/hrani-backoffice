import { Notification, toast } from '@/components/ui';
import { closeSnackbarDialog } from '@/redux/child-reducers';
import { useAppDispatch, useAppStore } from '@/redux/store.hooks';
import React, { useEffect } from 'react'

export const RTSnackbarDialog = () => {
    const dispatch = useAppDispatch();
    const {
        visible,
        content: { variant, message } } = useAppStore().loadingAndSnackbar.snackbar;

    const colseSnackbar = () => {
        dispatch(closeSnackbarDialog())
    }

    console.log("visible ===>", visible)
    useEffect(() => {
        if (visible) {
            toast.push(<Notification type={variant || 'danger'}>{message}</Notification>, { placement: 'top-end' });
            setTimeout(() => {
                colseSnackbar()
            }, 2000)
        }
    }, [visible, dispatch]);

    return <></>

}

import classNames from 'classnames'
import Modal from 'react-modal'
import CloseButton from '../CloseButton'
import { motion } from 'framer-motion'
import type ReactModal from 'react-modal'
import type { MouseEvent, ReactNode } from 'react'

export interface DrawerProps extends ReactModal.Props {
    bodyClass?: string
    closable?: boolean
    footer?: string | ReactNode
    footerClass?: string
    headerClass?: string
    height?: string | number
    lockScroll?: boolean
    onClose?: (e: MouseEvent<HTMLSpanElement>) => void
    placement?: 'top' | 'right' | 'bottom' | 'left'
    showBackdrop?: boolean
    title?: string | ReactNode
    width?: string | number
    mobileBreakpoint?: number
}

const Drawer = (props: DrawerProps) => {
    const {
        bodyOpenClassName,
        bodyClass,
        children,
        className,
        closable = true,
        closeTimeoutMS = 300,
        footer,
        footerClass,
        headerClass,
        height = 400,
        isOpen,
        lockScroll = true,
        onClose,
        overlayClassName,
        placement = 'right',
        portalClassName,
        showBackdrop = true,
        title,
        width = 400,
        mobileBreakpoint = 768,
        ...rest
    } = props

    const onCloseClick = (e: MouseEvent<HTMLSpanElement>) => {
        onClose?.(e)
    }

    const renderCloseButton = <CloseButton onClick={onCloseClick} />

    const getStyle = (): {
        dimensionClass?: string
        contentStyle?: {
            width?: string | number
            height?: string | number
        }
        motionStyle: {
            [x: string]: string
        }
    } => {
        const isMobile =
            typeof window !== 'undefined' &&
            window.innerWidth < mobileBreakpoint

        if (placement === 'left' || placement === 'right') {
            return {
                dimensionClass: 'vertical',

                contentStyle: {
                    width: isMobile ? 'calc(100vw - 40px)' : width,
                    maxWidth: isMobile ? 'none' : '90vw',
                },
                motionStyle: {
                    [placement]: isMobile
                        ? '-100vw'
                        : `-${width}${typeof width === 'number' && 'px'}`,
                },
            }
        }

        if (placement === 'top' || placement === 'bottom') {
            return {
                dimensionClass: 'horizontal',

                contentStyle: {
                    height: isMobile ? 'calc(100vh - 40px)' : height,
                    maxHeight: isMobile ? 'none' : '90vh',
                },
                motionStyle: {
                    [placement]: isMobile
                        ? '-100vh'
                        : `-${height}${typeof height === 'number' && 'px'}`,
                },
            }
        }

        return {
            motionStyle: {},
        }
    }

    const { dimensionClass, contentStyle, motionStyle } = getStyle()

    return (
        <Modal
            className={{
                base: classNames('drawer', className as string),
                afterOpen: 'drawer-after-open',
                beforeClose: 'drawer-before-close',
            }}
            overlayClassName={{
                base: classNames(
                    'drawer-overlay',
                    overlayClassName as string,
                    !showBackdrop && 'bg-transparent',

                    typeof window !== 'undefined' &&
                        window.innerWidth < mobileBreakpoint
                        ? 'drawer-overlay-mobile'
                        : '',
                ),
                afterOpen: 'drawer-overlay-after-open',
                beforeClose: 'drawer-overlay-before-close',
            }}
            portalClassName={classNames('drawer-portal', portalClassName)}
            bodyOpenClassName={classNames(
                'drawer-open',
                lockScroll && 'drawer-lock-scroll',
                bodyOpenClassName,
            )}
            ariaHideApp={false}
            isOpen={isOpen}
            closeTimeoutMS={closeTimeoutMS}
            {...rest}
        >
            <motion.div
                className={classNames(
                    'drawer-content',
                    dimensionClass,

                    typeof window !== 'undefined' &&
                        window.innerWidth < mobileBreakpoint
                        ? 'drawer-content-mobile'
                        : '',
                )}
                style={contentStyle}
                initial={motionStyle}
                animate={{
                    [placement as 'top' | 'right' | 'bottom' | 'left']: isOpen
                        ? 0
                        : motionStyle[placement],
                }}
            >
                {title || closable ? (
                    <div
                        className={classNames(
                            'drawer-header',
                            headerClass,

                            typeof window !== 'undefined' &&
                                window.innerWidth < mobileBreakpoint
                                ? 'drawer-header-mobile'
                                : '',
                        )}
                    >
                        {typeof title === 'string' ? (
                            <h4 className="text-lg md:text-xl">{title}</h4>
                        ) : (
                            <span>{title}</span>
                        )}
                        {closable && (
                            <div className="ml-auto">{renderCloseButton}</div>
                        )}
                    </div>
                ) : null}
                <div
                    className={classNames(
                        'drawer-body',
                        bodyClass,

                        typeof window !== 'undefined' &&
                            window.innerWidth < mobileBreakpoint
                            ? 'drawer-body-mobile'
                            : '',
                    )}
                >
                    {children}
                </div>
                {footer && (
                    <div
                        className={classNames(
                            'drawer-footer',
                            footerClass,

                            typeof window !== 'undefined' &&
                                window.innerWidth < mobileBreakpoint
                                ? 'drawer-footer-mobile'
                                : '',
                        )}
                    >
                        {footer}
                    </div>
                )}
            </motion.div>
        </Modal>
    )
}

Drawer.displayName = 'Drawer'

export default Drawer

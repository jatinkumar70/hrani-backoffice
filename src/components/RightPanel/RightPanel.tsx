import React from 'react'
import { IRightPanelProps } from './interfaces/IRightPanelProps'
import { motion, AnimatePresence } from 'framer-motion'

export const RightPanel: React.FC<IRightPanelProps> = (props) => {
    const {
        open,
        heading,
        isWrappedWithForm = false,
        width = '35%',
        mobileWidth = '90%',
        onFormSubmit,
        subHeading,
        actionButtons,
        rightHeading,
        onClose,
    } = props

    const content = () => {
        return (
            <div className="flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                    <div className="px-5">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                            {heading}
                        </h2>
                        {subHeading && (
                            <p className="text-base text-gray-600 dark:text-gray-300">
                                {subHeading}
                            </p>
                        )}
                    </div>
                    {rightHeading && (
                        <div className="px-5">{rightHeading()}</div>
                    )}
                </div>
                <div
                    className="flex-grow overflow-y-auto p-5"
                    style={{ zIndex: 1 }}
                >
                    {props.children}
                </div>
                {actionButtons && (
                    <div className="px-5">
                        <hr className="my-3 border-gray-200 dark:border-gray-600" />
                        {actionButtons()}
                    </div>
                )}
            </div>
        )
    }

    const wrappedWithForm = () => {
        if (isWrappedWithForm && onFormSubmit) {
            return (
                <form className="h-full" onSubmit={onFormSubmit}>
                    {content()}
                </form>
            )
        }
        return content()
    }

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/30 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className={`fixed inset-y-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50`}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', ease: 'easeInOut' }}
                        style={{
                            width: `clamp(300px, ${
                                window.innerWidth < 768 ? mobileWidth : width
                            }, 100%)`,
                        }}
                    >
                        <div className="h-screen p-0 pt-10 pb-[1%]">
                            {wrappedWithForm()}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

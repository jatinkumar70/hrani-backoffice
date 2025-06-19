import { useState, useEffect, useRef } from 'react'
import useMergedRef from '../hooks/useMergeRef'
import classNames from 'classnames'
import type { CommonProps, TypeAttributes } from '../@types/common'
import type { ReactNode, Ref } from 'react'

export interface AvatarProps extends CommonProps {
    alt?: string
    icon?: ReactNode
    onClick?: () => void
    ref?: Ref<HTMLSpanElement>
    size?: 'lg' | 'md' | 'sm' | number
    shape?: Exclude<TypeAttributes.Shape, 'none'> | 'square'
    src?: string
    srcSet?: string
    name?: string
}

const getInitials = (name = '') => {
    const names = name.trim().split(' ')
    let initials = names[0].substring(0, 1).toUpperCase()

    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase()
    }

    return initials
}

const Avatar = (props: AvatarProps) => {
    const {
        alt,
        className,
        icon,
        ref = null,
        shape = 'circle',
        size = 'md',
        src,
        srcSet,
        name = '',
        ...rest
    } = props

    let { children } = props
    const [scale, setScale] = useState(1)

    const avatarChildren = useRef<HTMLSpanElement>(null)
    const avatarNode = useRef<HTMLSpanElement>(null)

    const avatarMergeRef = useMergedRef(ref, avatarNode)

    const innerScale = () => {
        if (!avatarChildren.current || !avatarNode.current) {
            return
        }
        const avatarChildrenWidth = avatarChildren.current.offsetWidth
        const avatarNodeWidth = avatarNode.current.offsetWidth
        if (avatarChildrenWidth === 0 || avatarNodeWidth === 0) {
            return
        }
        setScale(
            avatarNodeWidth - 8 < avatarChildrenWidth
                ? (avatarNodeWidth - 8) / avatarChildrenWidth
                : 1,
        )
    }

    useEffect(() => {
        innerScale()
    }, [scale, children])

    const sizeStyle =
        typeof size === 'number'
            ? {
                  width: size,
                  height: size,
                  minWidth: size,
                  lineHeight: `${size}px`,
                  fontSize: icon ? size / 2 : 12,
              }
            : {}

    const classes = classNames(
        'avatar',
        `avatar-${shape}`,
        typeof size === 'string' ? `avatar-${size}` : '',
        className,
    )

    const getBackgroundColor = (str: string) => {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash)
        }
        const hue = Math.abs(hash % 360)
        return `hsl(${hue}, 60%, 80%)`
    }

    if (src) {
        children = (
            <img
                className={`avatar-img avatar-${shape}`}
                src={src}
                srcSet={srcSet}
                alt={alt}
                loading="lazy"
            />
        )
    } else if (icon) {
        children = (
            <span className={classNames('avatar-icon', `avatar-icon-${size}`)}>
                {icon}
            </span>
        )
    } else if (name) {
        // Show initials when name is provided
        const initials = getInitials(name)
        const bgColor = getBackgroundColor(name)
        children = (
            <span
                className={`avatar-initials avatar-${shape}`}
                style={{
                    backgroundColor: bgColor,
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    fontSize: typeof size === 'number' ? size / 2.5 : undefined,
                }}
            >
                {initials}
            </span>
        )
    } else {
        const childrenSizeStyle =
            typeof size === 'number' ? { lineHeight: `${size}px` } : {}
        const stringCentralized = {
            transform: `translateX(-50%) scale(${scale})`,
        }
        children = (
            <span
                ref={avatarChildren}
                className={`avatar-string ${
                    typeof size === 'number' ? '' : `avatar-inner-${size}`
                }`}
                style={{
                    ...childrenSizeStyle,
                    ...stringCentralized,
                    ...(typeof size === 'number' ? { height: size } : {}),
                }}
            >
                {children}
            </span>
        )
    }

    return (
        <span
            ref={avatarMergeRef}
            className={classes}
            style={{ ...sizeStyle, ...rest.style }}
            {...rest}
        >
            {children}
        </span>
    )
}

export default Avatar

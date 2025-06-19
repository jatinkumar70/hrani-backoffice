import { Suspense } from 'react'
import Loading from '@/components/shared/Loading'
import AllRoutes from '@/components/route/AllRoutes'
import type { LayoutType } from '@/@types/theme'
import ViteAppRouter from '@/router/app-router'
import { useLocation } from 'react-router-dom'

interface ViewsProps {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    layout?: LayoutType
}

const Views = (props: ViewsProps) => {

    const location = useLocation()

    return (
        <Suspense key={location.key} fallback={<Loading loading={true} className="w-full" />}>
            <ViteAppRouter {...props} />
        </Suspense>
    )
}

export default Views

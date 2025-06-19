import { BrowserRouter } from 'react-router'
import Theme from '@/components/template/Theme'
import Layout from '@/components/layouts'
// import { AuthProvider } from '@/auth'
import Views from '@/views'
import appConfig from './configs/app.config'
import './locales'
import { AuthProvider } from './contexts'
import { appStore } from './redux'
import { Provider } from 'react-redux'

if (appConfig.enableMock) {
    import('./mock')
}

function App() {
    return (
        <Provider store={appStore}>
        <Theme>
            <BrowserRouter>
                <AuthProvider>
                    <Layout>
                        <Views />
                    </Layout>
                </AuthProvider>
            </BrowserRouter>
        </Theme>
        </Provider>
    )
}

export default App

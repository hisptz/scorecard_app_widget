import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { DataProvider, Provider } from '@dhis2/app-runtime'
import { DataStoreProvider } from '@dhis2/app-service-datastore'
import './App.css'
import { DATASTORE_NAMESPACE } from './core/constants/config'
import { FullPageLoader } from './shared/Components/Loaders'
import { CssReset } from '@dhis2/ui'

const appConfig: any = {
    baseUrl: 'http://localhost:8081',
    apiVersion: 35,
}
ReactDOM.render(
    <React.StrictMode>
       <Provider config={appConfig}>
            <DataProvider>
                <DataStoreProvider
                    namespace={DATASTORE_NAMESPACE}
                    loadingComponent={FullPageLoader}
                >
                    <CssReset />
                    <App />
                </DataStoreProvider>
            </DataProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

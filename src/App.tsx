import { Provider } from '@dhis2/app-runtime'
import { DataStoreProvider } from '@dhis2/app-service-datastore'
import React,{Suspense} from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {ConfirmDialogProvider} from "@hisptz/react-ui";

import './App.css'
import { RecoilRoot } from 'recoil'
import { DATASTORE_NAMESPACE } from './core/constants/config'
import useInitApp from './core/hooks/useInitApp'
import { FullPageLoader } from './shared/Components/Loaders'
import { CssReset } from '@dhis2/ui';
import FullPageError from "./shared/Components/Errors/FullPageError";


function App(): React.ReactElement {
    const appConfig: any = {
        baseUrl: "http://localhost:8081'",
        apiVersion: 35,
    }
    const { initializeState } = useInitApp()

    return (
        <Provider config={appConfig}>
            <DataStoreProvider
                namespace={DATASTORE_NAMESPACE}
                loadingComponent={FullPageLoader}
            >
                <CssReset />
                <RecoilRoot initializeState={initializeState}>
                <ErrorBoundary FallbackComponent={FullPageError}>
                    <ConfirmDialogProvider>
                        <Suspense fallback={<FullPageLoader/>}>
                            <div className="main-container">
                                <h3>ScoreCard DashBoard Widgets</h3>
                            </div>
                        </Suspense>
                    </ConfirmDialogProvider>
                </ErrorBoundary>
            </RecoilRoot>
            </DataStoreProvider>
        </Provider>
    )
}

export default App

import React,{Suspense} from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {ConfirmDialogProvider} from "@hisptz/react-ui";
import './App.css'
import { RecoilRoot } from 'recoil'
import useInitApp from './core/hooks/useInitApp'
import { FullPageLoader } from './shared/Components/Loaders'
import Router from "./modules/Router";
import FullPageError from "./shared/Components/Errors/FullPageError";


function App(): React.ReactElement {
   
    const { initializeState } = useInitApp()

    return (
        <RecoilRoot initializeState={initializeState}>
                <ErrorBoundary FallbackComponent={FullPageError}>
                    <ConfirmDialogProvider>
                        <Suspense fallback={<FullPageLoader/>}>
                            <div className="main-container">
                            <Router/>
                            </div>
                        </Suspense>
                    </ConfirmDialogProvider>
                </ErrorBoundary>
            </RecoilRoot>
    )
}

export default App

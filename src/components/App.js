import React from 'react'
import { Provider } from '@dhis2/app-runtime'
import { CssReset } from '@dhis2/ui-core'
import { Main } from './Main'
import 'typeface-roboto'

const config = {
    baseUrl: "http://localhost:8081",
    apiVersion: 35,
}

export const App = () => (
    <Provider config={config}>
        <CssReset />
        <Main />
    </Provider>
)

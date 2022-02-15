import { App } from './App'
import ReactDOM from 'react-dom'
import React from 'react'
import { Provider } from '@dhis2/app-runtime'

const rootElement = document.getElementById('root')

if(process.env.NODE_ENV === 'production'){
    const productionRender = async () => {
        try {
            const manifest = await (await fetch('./manifest.webapp')).json()
            render(manifest.activities.dhis.href)
        } catch (error) {
            console.error('Could not read manifest:', error)
            ReactDOM.render(<code>No manifest found</code>, rootElement)
        }
    }

    const render = baseUrl =>
    ReactDOM.render(
        <Provider
                config={{
                    baseUrl: baseUrl,
                    apiVersion: 34,
                }}
            >
                <App />
            </Provider>,
        rootElement
    )

    productionRender()
}
else{
    ReactDOM.render(
        <Provider
        config={{
            baseUrl: "http://localhost:8081",
            apiVersion: 34,
        }}
    >
       <App />
    </Provider>,
        rootElement
    )
}






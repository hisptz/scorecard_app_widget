import React from 'react';
import './App.css';
import {Provider} from "@dhis2/app-runtime";
import { CssReset } from '@dhis2/ui-core'


function App() :React.ReactElement {

  const appConfig:any = {
    baseUrl: process.env.REACT_APP_DHIS2_BASE_URL,
    apiVersion: process.env.REACT_APP_DHIS2_BASE_URL_API_VERSION,
  }


  return (
    <Provider  config={appConfig}>
      <CssReset />
    <div className="App">

          app
    </div>
    </Provider>
  );
}

export default App;

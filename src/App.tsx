import {Provider} from "@dhis2/app-runtime";
import React from 'react';
import './App.css';

function App() :React.ReactElement {

  const appConfig:any = {
    baseUrl: "http://localhost:8081'",
    apiVersion: 35,
  }

  return (
    <Provider  config={appConfig}>
    <div className="App">
          Welcome Into the widget
    </div>
    </Provider>
  );
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import 'index.css';
import App from 'App';
import * as serviceWorker from 'serviceWorker';
import { Auth0Provider } from "@auth0/auth0-react";
import { ApolloProvider } from '@apollo/react-hooks';
import {client} from "api/apolloClient"
ReactDOM.render(
  <Auth0Provider
    domain= "dev-50-zt9d7.us.auth0.com"
    clientId= "4uD40BOHBbyrO5E3NjsF4osdeTb5sJPz"
    redirectUri="http://localhost:3000/login"
    audience= "DisasterAidApi"
  >
  <ApolloProvider client={client}>
  <React.StrictMode>
       <App />  
  </React.StrictMode>,
  </ApolloProvider>
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

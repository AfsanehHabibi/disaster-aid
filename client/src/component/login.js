import React from "react";
import {Detail} from 'component/detail';
import { useAuth0 } from "@auth0/auth0-react";
import { Layout, Menu, ConfigProvider, Radio, Dropdown, Button, Tag } from 'antd';

const Login = () => {
  
  const {
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
  } = useAuth0();

  async function getToken() {
    if(isAuthenticated){
      getAccessTokenSilently().then((token)=>{
        console.log(token)
        localStorage.setItem('token',token)
      })
    }
  }
  
  return (
    <Button >

        {isAuthenticated && getToken() &&(
          <Detail />
        )}

        {!isAuthenticated && (
           <a onClick={() => loginWithRedirect({returnTo: `${process.env.REACT_APP_PUBLIC_URL}/login`})}>
              Log in
           </a>
        )}

    </Button>
  );
};

export default Login;
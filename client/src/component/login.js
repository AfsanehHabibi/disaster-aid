import React from "react";
import {Detail} from 'component/detail';
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  
  const {
    user,
    isAuthenticated,
    getAccessToken,
    loginWithRedirect,
    getAccessTokenSilently,
    logout,
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
    <div >

        {isAuthenticated && getToken() &&(
          <Detail />
        )}

        {!isAuthenticated && (
           <a onClick={() => loginWithRedirect({returnTo: `${process.env.REACT_APP_PUBLIC_URL}/login`})}>
              Log in
           </a>
        )}

    </div>
  );
};

export default Login;
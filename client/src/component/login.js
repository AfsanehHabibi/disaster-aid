import React, { useState ,useEffect} from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import {
  Collapse,
  Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

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
  const logoutWithRedirect = () =>
    logout({
      returnTo: `${process.env.REACT_APP_PUBLIC_URL}`,
    });

  return (
    <div >

        {isAuthenticated && getToken() &&(
          <div>
            <a onClick={() => logoutWithRedirect()}>
               <FontAwesomeIcon icon="power-off" className="mr-3" /> Log out
            </a> 
          </div>
        )}

        {!isAuthenticated && (
           <a
           onClick={() => loginWithRedirect({returnTo: `${process.env.REACT_APP_PUBLIC_URL}/login`})}
           >
              Log in
           </a>
        )}

    </div>
  );
};

export default Login;
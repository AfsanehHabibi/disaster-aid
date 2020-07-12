import React, { useState } from "react";
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
    loginWithRedirect,
    logout,
  } = useAuth0();

  const logoutWithRedirect = () =>
    logout({
      returnTo: "http://localhost:3000",
    });

  const menu = (
    <Menu>

      <Menu.Item>
        <Button
        tag={RouterNavLink}
        to="/profile"
        className="dropdown-profile"
        activeClassName="router-link-exact-active"
        >
        <FontAwesomeIcon icon="user" className="mr-3" /> Profile
        </Button>
      </Menu.Item>

      <Menu.Item>
        <a
        onClick={() => logoutWithRedirect()}
        >
        <FontAwesomeIcon icon="power-off" className="mr-3" /> Log out
        </a>
        </Menu.Item>

      </Menu>
  );

  return (
    <div >

        {isAuthenticated && (
          <div>
           <Dropdown overlay={menu}>
              <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
               detail <DownOutlined />
              </a>
            </Dropdown>
            </div>
        )}

        {!isAuthenticated && (
           <a
           onClick={() => loginWithRedirect({})}
           >
              Log in
           </a>
        )}

    </div>
  );
};

export default Login;
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
    logout,
  } = useAuth0();

  const auth = useAuth0();
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    async function getAccessToken() {
      try {
        const token = await isAuthenticated?.getTokenSilently();
        setAccessToken(token);
      } catch (err) {
        console.error(err);
      }
    }

    getAccessToken();
  }, []);

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
      <Menu.Item>
        <Button
        tag={RouterNavLink}
        to="/get-jwt"
        exact
        activeClassName="router-link-exact-active"
        >
          get jwt
        </Button>
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
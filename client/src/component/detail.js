import React from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { NavLink as RouterNavLink , Redirect} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Button } from "reactstrap";
import Can from 'component/can';
export const Detail = () => {

  const {
    user,
    logout,
    getIdTokenClaims
  } = useAuth0();

  const logoutWithRedirect = () =>
    logout({
      returnTo: `${process.env.REACT_APP_PUBLIC_URL}`,
    });

  const menu = (
    <Menu>
      <Can
        role={user[process.env.REACT_APP_ROLE_URL]}
        perform="read:form-descriptor"
        yes={() => (
          <Menu.Item>
            <a onClick={() => <Redirect to="/forms" /> } >
          <FontAwesomeIcon icon="power-off" className="mr-3" /> report
        </a>
            {/* <Button
              tag={RouterNavLink}
              to="/forms"
              activeClassName="router-link-exact-active"
            > report
        </Button> */}
          </Menu.Item>
        )}
      />
      <Can
        role={user[process.env.REACT_APP_ROLE_URL]}
        perform="read:form-filled"
        yes={() => (
          <Menu.Item>
            <a onClick={() => <Redirect to="/controlCentre" /> } >
          <FontAwesomeIcon icon="power-off" className="mr-3" /> summery
        </a>
            {/* <Button
              tag={RouterNavLink}
              to="/controlCentre"
              activeClassName="router-link-exact-active"
            >summery
        </Button> */}
          </Menu.Item>
        )}
      />

      <Menu.Item>
        <a onClick={() => logoutWithRedirect()} >
          <FontAwesomeIcon icon="power-off" className="mr-3" /> Log out
        </a>
      </Menu.Item>

    </Menu>

  );

  return (
    <div>
      <Dropdown overlay={menu}>
        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
          detail <DownOutlined />
        </a>
      </Dropdown>
    </div>
  )
};

export default withAuthenticationRequired(Detail);


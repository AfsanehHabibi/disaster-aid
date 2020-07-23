import React from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {Button} from "reactstrap";

export const Detail = () => {

  const {
    user,
    logout,
  } = useAuth0();

  const logoutWithRedirect = () =>
    logout({
      returnTo: `${process.env.REACT_APP_PUBLIC_URL}`,
    });

  var userJson=Object.values(user)
  var firstvalue=""
  var secondvalue=""
  var firstpath=""
  var secondpath=""

  for(var i=0; i<4 ; i++){
     if(userJson[i]!="noting"){
        firstvalue=userJson[i]
     }
  }
 
  if(firstvalue==="Field Agents"){
     firstvalue = "report";
     firstpath = "/forms";
   }else if(firstvalue ==="Control Centre Agent"){
     firstvalue = "summery";
     firstpath ="/controlCentre";
   }else if(firstvalue ==="Admin"){
     firstvalue = "report";
     firstpath = "/forms";
     secondvalue = "summery";
     secondpath ="/controlCentre";
   }

  const menu = (
    <Menu>

      <Menu.Item>
        <Button
        tag={RouterNavLink}
        to={firstpath}
        activeClassName="router-link-exact-active"
        >
          <FontAwesomeIcon icon="user" className="mr-3" /> {firstvalue}
        </Button>
      </Menu.Item>

      <Menu.Item>
        <Button
        tag={RouterNavLink}
        to={secondpath}
        activeClassName="router-link-exact-active"
        >
          {secondvalue}
        </Button>
      </Menu.Item>

      <Menu.Item>
        <a  onClick={() => logoutWithRedirect()} >
          <FontAwesomeIcon icon="power-off" className="mr-3" /> Log out
        </a>
      </Menu.Item>

    </Menu>

   );

   return(
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


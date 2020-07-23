import React from "react";
import { Typography } from 'antd';
import { useAuth0 } from "@auth0/auth0-react";


const Descript = () => {
  
  const { Title } = Typography;
  const { user, isAuthenticated } = useAuth0();

  return (
    isAuthenticated && (
        <div>
          <Title style={{ textAlign: "center"}} >welcome {user.nickname.split(".78")}</Title>
        </div>
    )
  );

};

export default Descript;
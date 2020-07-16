import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { LoadList } from 'component/list.js';
export const ProfileComponent = () => {
  const { user   } = useAuth0();

 

  var userJson=Object.values(user)
  var value=""

  for(var i=0; i<4 ; i++){
        if(userJson[i]!="noting"){
          value=userJson[i]
        }
  }
 
   if(value==="Field Agents"){
    return  <LoadList />
   }else{
    return (
      <Container className="mb-5">
        <Row className="align-items-center profile-header mb-5 text-center text-md-left">
          <Col md={2}>
            <img
              src={user.picture}
              alt="Profile"
              className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
            />
          </Col>
          <Col md>
            {value}
          </Col>
   
      </Row>
     </Container>
    );
   }
};

export default withAuthenticationRequired(ProfileComponent);


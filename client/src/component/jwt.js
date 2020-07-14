import React, { useState } from "react";
import { Button, Alert } from "reactstrap";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";


export const JwtComponent = () => {
  const [state, setState] = useState({
    showResult: false,
    apiMessage: "",
    error: null,
  });

  const {
    getAccessTokenSilently,
  } = useAuth0();


  const callApi = async () => {
    try {
      const token = await getAccessTokenSilently();

      const responseData = await token;

      setState({
        ...state,
        showResult: true,
        apiMessage: responseData,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }
  };


  return (
    <>
      <div className="mb-5">
        <Button color="primary" className="mt-5" onClick={callApi}>
          Ping API
        </Button>
      </div>
      {state.apiMessage}
    </>
  );
};

export default withAuthenticationRequired(JwtComponent);

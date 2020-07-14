import React from "react";
const axios = require('axios').default;

export class AuthTest extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          loading: true,
          render:<p>no news</p>
        };
      }
    componentDidMount(){
        axios.get("http://localhost:5000/api/private")
        .then(res =>{
            console.debug(res)
            this.setState({
                loading: false,
                render: <p>you are authenticated!</p>
              });
        })
        .catch(e =>{
            this.setState({
                loading: false,
                render: <p>you are not authenticated</p>
              });
        }

        )
    }
    render(){
        return(this.state.render);
    }
}
import React from 'react';

const axios = require('axios').default;
let fakeDataUrl='/api/test'
export class TestConnection extends React.Component {
    state = {
      initLoading: true,
      data:"nothing",
      s:"not changed"
    };
  
    componentDidMount() {
      this.getData(response => {
          console.debug("response1")
          console.debug(response)
          console.debug("response2")
        this.setState({
            s:"changes",
          initLoading: false,
          data: response.data});
        console.debug(this.state.data)
      });
    }
  
    getData = callback => {
      axios.get(fakeDataUrl)
      .then(function (response) {
        // handle success
        callback(response);
        console.log(response);
        
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
      /* reqwest({
        url: fakeDataUrl,
        type: 'json',
        method: 'get',
        contentType: 'application/json',
        success: res => {
          callback(res);
        },
      }); */
    };
  
  
    
    render() {
      const { initLoading, data,s} = this.state;
      return (
      !initLoading ? <div>{data.message}</div>:<div>loading{s}</div>
      );
    }
  }
  
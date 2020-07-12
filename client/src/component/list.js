import React from 'react';
import 'antd/dist/antd.css';
import { List,  Button} from 'antd';
import {Link} from 'react-router-dom';

const axios = require('axios').default;
const count = 3;
const fakeDataUrl =`https://secret-chamber-63894.herokuapp.com/api/forms`;
export class LoadMoreList extends React.Component {
  state = {
    initLoading: true,
    loading: false,
    data: [],
    list: [],
  };

  componentDidMount() {
    this.getData(response => {
        console.debug("response1")
        console.debug(response)
        console.debug("response2")
      this.setState({
        initLoading: false,
        data: response.data.forms,
        list: response.data.forms,
      });
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

  onLoadMore = () => {
    console.debug("response3")
    console.debug(this.state.data)
    console.debug("response4")
    this.setState({
      loading: true,
      list: this.state.data.concat([...new Array(count)].map(() => ({ loading: true, name: {} }))),
    });
    this.getData(response => {
      const data = this.state.data.concat(response.results);
      this.setState(
        {
          data,
          list: data,
          loading: false,
        },
        () => {
          // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
          // In real scene, you can using public method of react-virtualized:
          // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
          window.dispatchEvent(new Event('resize'));
        },
      );
    });
  };

  
  render() {
    const { initLoading, loading, list } = this.state;
    const loadMore =
      !initLoading && !loading ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            height: 32,
            lineHeight: '32px',
          }}
        >
          <Button 
          //onClick={this.onLoadMore}
          >loading more</Button>
        </div>
      ) : null;

    return (
      <List
        className="demo-loadmore-list"
        loading={initLoading}
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={list}
        renderItem={item => (
          <List.Item 
            actions={[<Link to={`/form/${item.id}`}>fill</Link>]}
          >
              <List.Item.Meta
               title={item.title}
                />
          </List.Item>
        )}
      />
    );
  }
}

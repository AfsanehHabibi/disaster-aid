import React from 'react';
import 'antd/dist/antd.css';
import { List, Button } from 'antd';
import { Link } from 'react-router-dom';
import { useQuery } from "@apollo/react-hooks";
import { formsDesIdTitle } from 'api/graphqlQueryStr';
import { NotFound } from 'component/notFound';
import gql from "graphql-tag";


export let LoadList = (props) => {
  const { loading:initLoading , error, data:receivedData } = useQuery(gql(formsDesIdTitle()))
  let data = [];
  let list = [];


  if (error){
    console.error(error)
    return <NotFound/>
  }
  if (!initLoading && receivedData){
    console.debug(receivedData)
    data= receivedData.formDesMany;
    list= receivedData.formDesMany;
  }
    
  const loadMore =
    !initLoading  ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button
        //onClick={onLoadMore}
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
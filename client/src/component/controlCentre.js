import React from 'react';
import 'antd/dist/antd.css';
import { List, Button } from 'antd';
import { Link } from 'react-router-dom';
import { useQuery } from "@apollo/react-hooks";
import { formsIdTitle } from 'api/graphqlQueryStr';
import { NotFound } from 'component/notFound';
import gql from "graphql-tag";


export let FormList = (props) => {
  const { loading:initLoading , error, data:receivedData } = useQuery(gql(formsIdTitle()))
  let data = [];
  let list = [];


  if (error)
    return <NotFound/>
  if (!initLoading && receivedData){
    console.debug(receivedData)
    data= receivedData.formMany;
    list= receivedData.formMany;
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
          actions={[<Link to={`/summary/form/${item.form_descriptor.id}`}>view summary</Link>]}
        >
          <List.Item.Meta
            title={item.form_descriptor.title}
          />
        </List.Item>
      )}
    />
  );
}
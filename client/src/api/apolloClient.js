import React from 'react';
import ApolloClient from 'apollo-boost';

export const client = new ApolloClient({
  uri: 'https://shrouded-garden-53962.herokuapp.com/graphql',
});
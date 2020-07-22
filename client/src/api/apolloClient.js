import React from 'react';
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: '/graphql',//'http://localhost:5000/graphql',
});
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = //`eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlVKOWdySXVFNGpuUXV1cDZfZzBhSiJ9.eyJpc3MiOiJodHRwczovL2Rldi01MC16dDlkNy51cy5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NWYwMjU1YTkyZWIzMDMwMDE5YzgzMGNmIiwiYXVkIjpbIkRpc2FzdGVyQWlkQXBpIiwiaHR0cHM6Ly9kZXYtNTAtenQ5ZDcudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTU5NTMzMTMwMywiZXhwIjoxNTk1NDE3NzAzLCJhenAiOiI0dUQ0MEJPSEJieXJPNUUzTmpzRjRvc2RlVGI1c0pQeiIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJwZXJtaXNzaW9ucyI6WyJjcmVhdGU6dXNlcnMiLCJkZWxldGU6dXNlcnMiLCJyZWFkOm1lc3NhZ2VzICIsInJlYWQ6dXNlcnMiXX0.mIeZUSWClzS1cPaMp8Ga0PffB8OI-lRvKodDw2IRoXl3q9AMpObCxQ8UeF2mfkymV1mP0mjDpCmU2mdBDoGIjJRQa4nvK7wJPt-IQNo3tsrrf2QavEPxYK6MfRq4-gnv194o-ZtGH6_MyecEcVhUjxHb7mgmFosVfgqwt928JEChmG3M2lb5y6aVj-WIq39Mpv9wuBtiq4kJ6KzB81DZGB4dgSMsWdvdQC7vwFjOi92s8_vtqkwmyN9xOsjL7aFUPQt7BnRjSW3FevuKjAC05W_-66D_tcqWN0Z06lnC7v9ogBLhdzpSOMj7djdxaQfndKxglZy7dTVf1Ja30oqQkQ`//
  localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      //authorization: token ? `Bearer ${token}` : "",
      authorization: `Bearer ${token}`,
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
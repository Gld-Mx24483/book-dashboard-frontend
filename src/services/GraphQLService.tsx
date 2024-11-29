//GraphQLService.tsx
import { 
  ApolloClient, 
  InMemoryCache, 
  createHttpLink,
  ApolloProvider
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';

const GraphQLProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // const httpLink = createHttpLink({
  //   uri: process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:9000/graphql',
  // });

  const graphqlEndpoint = 
    process.env.NODE_ENV === 'production' 
      ? process.env.REACT_APP_PRODUCTION_BACKEND_URL 
      : process.env.REACT_APP_LOCAL_BACKEND_URL || 'http://localhost:9000/graphql';

  const httpLink = createHttpLink({
    uri: graphqlEndpoint,
  });

  const authLink = setContext(async () => {
    if (!isAuthenticated) return {};
    
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE
        }
      });
      return {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    } catch (error) {
      console.error('Error getting token', error);
      return {};
    }
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default GraphQLProvider;
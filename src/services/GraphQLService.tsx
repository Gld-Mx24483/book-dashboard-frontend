import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context'; // For setting the context headers for requests
import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';

const GraphQLProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Destructure Auth0 hooks to get the token silently and check authentication status
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // Determine the GraphQL endpoint based on the environment (production or local)
  const graphqlEndpoint =
    process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_PRODUCTION_BACKEND_URL // Production URL if in production environment
      : process.env.REACT_APP_LOCAL_BACKEND_URL || // Local URL or fallback to default
        'http://localhost:9000/graphql';

  // HTTP link to connect Apollo Client to the GraphQL server
  const httpLink = createHttpLink({
    uri: graphqlEndpoint, // GraphQL endpoint URL
  });

  // Create an authentication link to add the Authorization header with the access token
  const authLink = setContext(async () => {
    if (!isAuthenticated) return {};

    try {
      // Get access token silently with Auth0
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE, // Audience for Auth0 token
        },
      });
      return {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      };
    } catch (error) {
      console.error('Error getting token', error);
      return {};
    }
  });

  // Apollo Client instance with the authentication and HTTP links
  const client = new ApolloClient({
    link: authLink.concat(httpLink), // Concatenate auth and HTTP links
    cache: new InMemoryCache(), // Use in-memory caching for query results
  });

  // Wrap children with ApolloProvider to provide Apollo Client context
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default GraphQLProvider;

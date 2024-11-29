//AuthProvider.tsx
import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { ChakraProvider, defineConfig, createSystem } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    tokens: {
      colors: {},
    },
  },
});

const system = createSystem(config);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN || ''}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID || ''}
      authorizationParams={{
        redirect_uri: window.location.origin,
        // Remove or comment out the audience if not using a specific API
        // audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: 'openid profile email',
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <ChakraProvider value={system}>{children}</ChakraProvider>
    </Auth0Provider>
  );
};

export default AuthProvider;
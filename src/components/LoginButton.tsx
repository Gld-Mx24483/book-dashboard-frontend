// LoginButton.tsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@chakra-ui/react';

const LoginButton: React.FC = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  if (isAuthenticated) return null;

  const handleLogin = async () => {
    try {
      await loginWithRedirect({
        appState: {
          returnTo: '/dashboard',
        },
      });
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  return (
    <Button
      className='sci-fi-auth-button login-button'
      onClick={handleLogin}
      variant='outline'
    >
      Log In
    </Button>
  );
};

export default LoginButton;

//LoginButton.tsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, VStack } from '@chakra-ui/react';

const LoginButton: React.FC = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  if (isAuthenticated) return null;

  const handleLogin = async () => {
    try {
      await loginWithRedirect({
        appState: {
          returnTo: '/dashboard'
        }
      });
    } catch (error) {
      console.error('Login Error:', error);
      // Optionally show a user-friendly error message
    }
  };

  return (
    <VStack>
      <Button 
        colorScheme="blue" 
        onClick={handleLogin}
      >
        Log In
      </Button>
    </VStack>
  );
};

export default LoginButton;
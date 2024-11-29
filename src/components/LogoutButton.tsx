// LogoutButton.tsx
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@chakra-ui/react';

const LogoutButton: React.FC = () => {
  const { logout, isAuthenticated } = useAuth0();

  if (!isAuthenticated) return null;

  return (
    <Button 
      className="sci-fi-auth-button logout-button"
      onClick={() => logout({ 
        logoutParams: { 
          returnTo: window.location.origin 
        } 
      })}
      variant="outline"
    >
      Log Out
    </Button>
  );
};

export default LogoutButton;
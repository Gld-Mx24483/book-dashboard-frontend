//App.tsx
import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route 
} from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react';
import AuthProvider from './components/AuthProvider';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import ProtectedRoute from './components/ProtectedRoute';
import BookTable from './components/BookTable';
import GraphQLProvider from './services/GraphQLService';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <GraphQLProvider>
        <Router>
          <Container maxW="container.xl" py={8}>
            <Box mb={4} display="flex" justifyContent="flex-end">
              <LoginButton />
              <LogoutButton />
            </Box>
            
            <Routes>
              <Route path="/" element={<BookTable />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <BookTable />
                  </ProtectedRoute>
                } 
              />
              <Route path="/login" element={<LoginButton />} />
            </Routes>
          </Container>
        </Router>
      </GraphQLProvider>
    </AuthProvider>
  );
};

export default App;
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
            <Box mb={4}>
              <LoginButton />
              <LogoutButton />
            </Box>
            
            <Routes>
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

// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

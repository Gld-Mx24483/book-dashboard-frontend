//BookTable.tsx
import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Table } from '@chakra-ui/react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Button } from "../components/ui/button";
import './BookTable.css'; 

const GET_BOOKS = gql`
  query GetBooks {
    getBooks {
      id
      name
      description
    }
  }
`;

const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id) {
      id
    }
  }
`;

const BookTable: React.FC = () => {
  const { loading, error, data } = useQuery(GET_BOOKS);
  const { isAuthenticated, user } = useAuth0();
  
  // State to track loading for individual book deletions
  const [deletingBookIds, setDeletingBookIds] = useState<string[]>([]);

  const [deleteBook] = useMutation(DELETE_BOOK, {
    update(cache, { data: { deleteBook } }) {
      cache.modify({
        fields: {
          getBooks(existingBooks = [], { readField }) {
            return existingBooks.filter(
              (bookRef: any) => deleteBook.id !== readField('id', bookRef)
            );
          }
        }
      });
    },
    onCompleted: (data) => {
      // Remove the book ID from deletingBookIds
      setDeletingBookIds(prev => prev.filter(id => id !== data.deleteBook.id));
    },
    onError: (error) => {
      console.error("Error deleting book", error);
      // Remove the book ID from deletingBookIds in case of error
      setDeletingBookIds(prev => prev.filter(id => id !== error.graphQLErrors[0].extensions?.id));
    }
  });

  const handleDeleteBook = (bookId: string) => {
    // Add book ID to deletingBookIds to show loading state
    setDeletingBookIds(prev => [...prev, bookId]);
    
    deleteBook({ 
      variables: { id: bookId },
      optimisticResponse: {
        __typename: "Mutation",
        deleteBook: {
          __typename: "Book",
          id: bookId
        }
      }
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error.message}</div>;

  return (
    <div className="book-table-container">
      {/* User Profile Section*/}
      {isAuthenticated && user && (
        <div className="user-profile-sci-fi">
          <div className="user-profile-background"></div>
          <div className="user-profile-content">
            <div className="user-avatar-container">
              <img 
                src={user.picture} 
                alt={user.name} 
                className="user-avatar"
              />
              <div className="avatar-glitch"></div>
            </div>
            <div className="user-details">
              <h2 className="user-name">{user.name}</h2>
              <p className="user-email">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Book Table Section */}
      <Table.Root size="md" width="100%">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader textAlign="center" verticalAlign="middle">ID</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center" verticalAlign="middle">Name</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center" verticalAlign="middle">Description</Table.ColumnHeader>
            {isAuthenticated && <Table.ColumnHeader textAlign="center" verticalAlign="middle">Actions</Table.ColumnHeader>}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.getBooks.map((book: any) => (
            <Table.Row key={book.id}>
              <Table.Cell textAlign="center" verticalAlign="middle">{book.id}</Table.Cell>
              <Table.Cell textAlign="center" verticalAlign="middle">{book.name}</Table.Cell>
              <Table.Cell textAlign="center" verticalAlign="middle">{book.description}</Table.Cell>
              {isAuthenticated && (
  <Table.Cell textAlign="center" verticalAlign="middle">
    <div className="action-button-container">
      <Button 
        className="action-button edit-button"
        size="sm"
      >
        Edit
      </Button>
      <Button 
        className="action-button delete-button"
        size="sm"
      >
        Delete
      </Button>
    </div>
  </Table.Cell>
)}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default BookTable;
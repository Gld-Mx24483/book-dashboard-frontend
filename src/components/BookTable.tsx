// //BookTable.tsx
// import React, { useState } from 'react';
// import { useAuth0 } from '@auth0/auth0-react';
// import { Table } from '@chakra-ui/react';
// import { useQuery, useMutation, gql } from '@apollo/client';
// import { Button } from "../components/ui/button";
// import './BookTable.css'; 

// const GET_BOOKS = gql`
//   query GetBooks {
//     getBooks {
//       id
//       name
//       description
//     }
//   }
// `;

// const DELETE_BOOK = gql`
//   mutation DeleteBook($id: ID!) {
//     deleteBook(id: $id) {
//       id
//     }
//   }
// `;

// const BookTable: React.FC = () => {
//   const { loading, error, data } = useQuery(GET_BOOKS);
//   const { isAuthenticated, user } = useAuth0();
  
//   // State to track loading for individual book deletions
//   const [deletingBookIds, setDeletingBookIds] = useState<string[]>([]);

//   const [deleteBook] = useMutation(DELETE_BOOK, {
//     update(cache, { data: { deleteBook } }) {
//       cache.modify({
//         fields: {
//           getBooks(existingBooks = [], { readField }) {
//             return existingBooks.filter(
//               (bookRef: any) => deleteBook.id !== readField('id', bookRef)
//             );
//           }
//         }
//       });
//     },
//     onCompleted: (data) => {
//       // Remove the book ID from deletingBookIds
//       setDeletingBookIds(prev => prev.filter(id => id !== data.deleteBook.id));
//     },
//     onError: (error) => {
//       console.error("Error deleting book", error);
//       // Remove the book ID from deletingBookIds in case of error
//       setDeletingBookIds(prev => prev.filter(id => id !== error.graphQLErrors[0].extensions?.id));
//     }
//   });

//   const handleDeleteBook = (bookId: string) => {
//     // Add book ID to deletingBookIds to show loading state
//     setDeletingBookIds(prev => [...prev, bookId]);
    
//     deleteBook({ 
//       variables: { id: bookId },
//       optimisticResponse: {
//         __typename: "Mutation",
//         deleteBook: {
//           __typename: "Book",
//           id: bookId
//         }
//       }
//     });
//   };

//   if (loading) return <div className="loading">Loading...</div>;
//   if (error) return <div className="error">{error.message}</div>;

//   return (
//     <div className="book-table-container">
//       {/* User Profile Section*/}
//       {isAuthenticated && user && (
//         <div className="user-profile-sci-fi">
//           <div className="user-profile-background"></div>
//           <div className="user-profile-content">
//             <div className="user-avatar-container">
//               <img 
//                 src={user.picture} 
//                 alt={user.name} 
//                 className="user-avatar"
//               />
//               <div className="avatar-glitch"></div>
//             </div>
//             <div className="user-details">
//               <h2 className="user-name">{user.name}</h2>
//               <p className="user-email">{user.email}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Book Table Section */}
//       <Table.Root size="md" width="100%">
//         <Table.Header>
//           <Table.Row>
//             <Table.ColumnHeader textAlign="center" verticalAlign="middle">ID</Table.ColumnHeader>
//             <Table.ColumnHeader textAlign="center" verticalAlign="middle">Name</Table.ColumnHeader>
//             <Table.ColumnHeader textAlign="center" verticalAlign="middle">Description</Table.ColumnHeader>
//             {isAuthenticated && <Table.ColumnHeader textAlign="center" verticalAlign="middle">Actions</Table.ColumnHeader>}
//           </Table.Row>
//         </Table.Header>
//         <Table.Body>
//           {data.getBooks.map((book: any) => (
//             <Table.Row key={book.id}>
//               <Table.Cell textAlign="center" verticalAlign="middle">{book.id}</Table.Cell>
//               <Table.Cell textAlign="center" verticalAlign="middle">{book.name}</Table.Cell>
//               <Table.Cell textAlign="center" verticalAlign="middle">{book.description}</Table.Cell>
//               {isAuthenticated && (
//   <Table.Cell textAlign="center" verticalAlign="middle">
//     <div className="action-button-container">
//       <Button 
//         className="action-button edit-button"
//         size="sm"
//       >
//         Edit
//       </Button>
//       <Button 
//         className="action-button delete-button"
//         size="sm"
//       >
//         Delete
//       </Button>
//     </div>
//   </Table.Cell>
// )}
//             </Table.Row>
//           ))}
//         </Table.Body>
//       </Table.Root>
//     </div>
//   );
// };

// export default BookTable;

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

const CREATE_BOOK = gql`
  mutation CreateBook($createBookInput: CreateBookInput!) {
    createBook(createBookInput: $createBookInput) {
      id
      name
      description
    }
  }
`;

const UPDATE_BOOK = gql`
  mutation UpdateBook($updateBookInput: UpdateBookInput!) {
    updateBook(updateBookInput: $updateBookInput) {
      id
      name
      description
    }
  }
`;

const DELETE_BOOK = gql`
  mutation DeleteBook($id: Int!) {
    deleteBook(id: $id) {
      id
      name
      description
    }
  }
`;

interface Book {
  id: number;
  name: string;
  description?: string;
}

const BookTable: React.FC = () => {
  const { loading, error, data, refetch } = useQuery(GET_BOOKS);
  const { isAuthenticated, user } = useAuth0();
  
  // State for modals and form inputs
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookName, setBookName] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [currentBook, setCurrentBook] = useState<Book | null>(null);

  // Mutations
  const [createBook] = useMutation(CREATE_BOOK, {
    onCompleted: () => {
      refetch();
      setIsCreateModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Error creating book", error);
    }
  });

  const [updateBook] = useMutation(UPDATE_BOOK, {
    onCompleted: () => {
      refetch();
      setIsEditModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Error updating book", error);
    }
  });

  const [deleteBook] = useMutation(DELETE_BOOK, {
    onCompleted: () => {
      refetch();
      setIsDeleteModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error("Error deleting book", error);
    }
  });

  // Helper function to reset form
  const resetForm = () => {
    setBookName('');
    setBookDescription('');
    setCurrentBook(null);
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  // Handle Create Book
  const handleCreateBook = () => {
    createBook({
      variables: {
        createBookInput: {
          name: bookName,
          description: bookDescription
        }
      }
    });
  };

  // Open Edit Modal
  const handleOpenEditModal = (book: Book) => {
    setCurrentBook(book);
    setBookName(book.name);
    setBookDescription(book.description || '');
    setIsEditModalOpen(true);
  };

  // Handle Update Book
  const handleUpdateBook = () => {
    if (currentBook) {
      updateBook({
        variables: {
          updateBookInput: {
            id: currentBook.id,
            name: bookName,
            description: bookDescription
          }
        }
      });
    }
  };

  // Open Delete Modal
  const handleOpenDeleteModal = (book: Book) => {
    setCurrentBook(book);
    setIsDeleteModalOpen(true);
  };

  // Handle Delete Book
  const handleDeleteBook = () => {
    if (currentBook) {
      deleteBook({
        variables: { id: currentBook.id }
      });
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error.message}</div>;

  return (
    <div className="book-table-container">
      {/* User Profile Section */}
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

      {/* Add Book Button */}
      {isAuthenticated && (
        <div className="add-book-container">
          <button 
            className="floating-add-button" 
            onClick={handleOpenCreateModal}
          >
            +
          </button>
        </div>
      )}

      {/* Book Table */}
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
          {data.getBooks.map((book: Book) => (
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
                      onClick={() => handleOpenEditModal(book)}
                    >
                      Edit
                    </Button>
                    <Button 
                      className="action-button delete-button"
                      size="sm"
                      onClick={() => handleOpenDeleteModal(book)}
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

      {/* Create Book Modal */}
      {isCreateModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Create New Book</h2>
            <input 
              type="text"
              placeholder="Book Name"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              className="modal-input"
            />
            <textarea 
              placeholder="Book Description"
              value={bookDescription}
              onChange={(e) => setBookDescription(e.target.value)}
              className="modal-textarea"
            />
            <div className="modal-actions">
              <button 
                className="modal-button create-button"
                onClick={handleCreateBook}
                disabled={!bookName}
              >
                Create
              </button>
              <button 
                className="modal-button cancel-button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Edit Book</h2>
            <input 
              type="text"
              placeholder="Book Name"
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              className="modal-input"
            />
            <textarea 
              placeholder="Book Description"
              value={bookDescription}
              onChange={(e) => setBookDescription(e.target.value)}
              className="modal-textarea"
            />
            <div className="modal-actions">
              <button 
                className="modal-button update-button"
                onClick={handleUpdateBook}
                disabled={!bookName}
              >
                Update
              </button>
              <button 
                className="modal-button cancel-button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Book Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <h2 className="modal-title">Confirm Book Deletion</h2>
            <div className="delete-book-details">
              <p><strong>Name:</strong> {currentBook?.name}</p>
              {currentBook?.description && <p><strong>Description:</strong> {currentBook.description}</p>}
            </div>
            <p className="delete-confirmation-text">
              Are you sure you want to delete this book? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button 
                className="modal-button delete-button"
                onClick={handleDeleteBook}
              >
                Delete
              </button>
              <button 
                className="modal-button cancel-button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookTable;
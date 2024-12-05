//BookTable.tsx
import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Table } from '@chakra-ui/react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Button } from '../components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import './BookTable.css';

// GraphQL Queries and Mutations
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

// Utility function for text truncation
const truncateText = (text: string, maxLength: number = 50): string => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

// Book interface
interface Book {
  id: number;
  name: string;
  description?: string;
}

const BookTable: React.FC = () => {
  // Query and Authentication Hooks
  const { loading, error, data, refetch } = useQuery(GET_BOOKS);
  const { isAuthenticated, user } = useAuth0();

  // State Management
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBookDetailsModalOpen, setIsBookDetailsModalOpen] = useState(false);
  const [bookName, setBookName] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Mutation Hooks
  const [createBook] = useMutation(CREATE_BOOK, {
    onCompleted: () => {
      refetch();
      setIsCreateModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Error creating book', error);
    },
  });

  const [updateBook] = useMutation(UPDATE_BOOK, {
    onCompleted: () => {
      refetch();
      setIsEditModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Error updating book', error);
    },
  });

  const [deleteBook] = useMutation(DELETE_BOOK, {
    onCompleted: () => {
      refetch();
      setIsDeleteModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Error deleting book', error);
    },
  });

  // Helper Functions
  const resetForm = () => {
    setBookName('');
    setBookDescription('');
    setCurrentBook(null);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateBook = () => {
    createBook({
      variables: {
        createBookInput: {
          name: bookName,
          description: bookDescription,
        },
      },
    });
  };

  const handleOpenEditModal = (book: Book) => {
    setCurrentBook(book);
    setBookName(book.name);
    setBookDescription(book.description || '');
    setIsEditModalOpen(true);
  };

  const handleUpdateBook = () => {
    if (currentBook) {
      updateBook({
        variables: {
          updateBookInput: {
            id: Number(currentBook.id),
            name: bookName,
            description: bookDescription,
          },
        },
      });
    }
  };

  const handleOpenDeleteModal = (book: Book) => {
    setCurrentBook(book);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteBook = () => {
    if (currentBook) {
      deleteBook({
        variables: {
          id: parseInt(currentBook.id.toString(), 10),
        },
      });
    }
  };

  const handleOpenBookDetails = (book: Book) => {
    setSelectedBook(book);
    setIsBookDetailsModalOpen(true);
  };

  // Loading and Error States
  if (loading) return <div className='loading'>Loading, Backend Service Restarting on Render...</div>;
  if (error) return <div className='error'>{error.message}</div>;

  return (
    <div className='book-table-container'>
      {/* Book Dashboard Heading */}
      <h1 className='book-dashboard-title'>Book Dashboard</h1>
      <h2 className='book-dashboard-sub'>Welcome,</h2>

      {/* User Profile Section */}
      {isAuthenticated && user && (
        <div className='user-profile-sci-fi'>
          <div className='user-profile-background'></div>
          <div className='user-profile-content'>
            <div className='user-avatar-container'>
              <img src={user.picture} alt={user.name} className='user-avatar' />
              <div className='avatar-glitch'></div>
            </div>
            <div className='user-details'>
              <h2 className='user-name'>{user.name}</h2>
              <p className='user-email'>{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Book Button */}
      {isAuthenticated && (
        <div className='add-book-container'>
          <button
            className='floating-add-button'
            onClick={handleOpenCreateModal}
          >
            +
          </button>
        </div>
      )}

      <Table.Root size='md' width='100%'>
        <Table.Header>
          <Table.Row
            style={{
              borderBottom: '2px solid #e2e8f0',
              borderTop: '2px solid #e2e8f0',
            }}
          >
            <Table.ColumnHeader
              textAlign='center'
              style={{
                borderRight: '2px solid #e2e8f0',
                borderLeft: '2px solid #e2e8f0',
                padding: '12px 20px',
              }}
            >
              ID
            </Table.ColumnHeader>
            <Table.ColumnHeader
              textAlign='center'
              style={{
                borderRight: '2px solid #e2e8f0',
                padding: '12px 20px',
              }}
            >
              Name
            </Table.ColumnHeader>
            <Table.ColumnHeader
              textAlign='center'
              style={{
                borderRight: '2px solid #e2e8f0',
                padding: '12px 20px',
              }}
            >
              Description
            </Table.ColumnHeader>
            {isAuthenticated && (
              <Table.ColumnHeader
                textAlign='center'
                style={{
                  borderRight: '2px solid #e2e8f0',
                  padding: '12px 20px',
                }}
              >
                Actions
              </Table.ColumnHeader>
            )}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.getBooks.map((book: Book) => (
            <Table.Row
              key={book.id}
              style={{
                borderBottom: '1px solid #e2e8f0',
                borderLeft: '2px solid #e2e8f0',
              }}
            >
              <Table.Cell
                textAlign='center'
                style={{ borderRight: '1px solid #e2e8f0' }}
              >
                {book.id}
              </Table.Cell>
              <Table.Cell
                textAlign='center'
                style={{ borderRight: '1px solid #e2e8f0' }}
              >
                {book.name}
              </Table.Cell>
              <Table.Cell
                textAlign='center'
                onClick={() => handleOpenBookDetails(book)}
                style={{ cursor: 'pointer', borderRight: '1px solid #e2e8f0' }}
              >
                {truncateText(book.description || '')}
              </Table.Cell>
              {isAuthenticated && (
                <Table.Cell
                  textAlign='center'
                  style={{ borderRight: '1px solid #e2e8f0' }}
                >
                  <div className='action-button-container'>
                    <Button
                      className='action-button edit-button desktop-button'
                      size='sm'
                      onClick={() => handleOpenEditModal(book)}
                    >
                      Edit
                    </Button>
                    <Button
                      className='action-button delete-button desktop-button'
                      size='sm'
                      onClick={() => handleOpenDeleteModal(book)}
                    >
                      Delete
                    </Button>
                    <Button
                      className='mobile-icon-button edit-icon-button'
                      size='sm'
                      variant='ghost'
                      onClick={() => handleOpenEditModal(book)}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      className='mobile-icon-button delete-icon-button'
                      size='sm'
                      variant='ghost'
                      onClick={() => handleOpenDeleteModal(book)}
                    >
                      <Trash2 size={16} />
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
        <div className='modal-overlay'>
          <div className='modal-content'>
            <h2 className='modal-title'>Create New Book</h2>
            <input
              type='text'
              placeholder='Book Name'
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              className='modal-input'
            />
            <textarea
              placeholder='Book Description'
              value={bookDescription}
              onChange={(e) => setBookDescription(e.target.value)}
              className='modal-textarea'
            />
            <div className='modal-actions'>
              <button
                className='modal-button create-button'
                onClick={handleCreateBook}
                disabled={!bookName}
              >
                Create
              </button>
              <button
                className='modal-button cancel-button'
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
        <div className='modal-overlay'>
          <div className='modal-content'>
            <h2 className='modal-title'>Edit Book</h2>
            <input
              type='text'
              placeholder='Book Name'
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
              className='modal-input'
            />
            <textarea
              placeholder='Book Description'
              value={bookDescription}
              onChange={(e) => setBookDescription(e.target.value)}
              className='modal-textarea'
            />
            <div className='modal-actions'>
              <button
                className='modal-button update-button'
                onClick={handleUpdateBook}
                disabled={!bookName}
              >
                Update
              </button>
              <button
                className='modal-button cancel-button'
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
        <div className='modal-overlay'>
          <div className='modal-content delete-modal'>
            <h2 className='modal-title'>Confirm Book Deletion</h2>
            <div className='delete-book-details'>
              <p>
                <strong>Name:</strong> {currentBook?.name}
              </p>
              {currentBook?.description && (
                <p>
                  <strong>Description:</strong> {currentBook.description}
                </p>
              )}
            </div>
            <p className='delete-confirmation-text'>
              Are you sure you want to delete this book? This action cannot be
              undone.
            </p>
            <div className='modal-actions'>
              <button
                className='modal-button delete-button'
                onClick={handleDeleteBook}
              >
                Delete
              </button>
              <button
                className='modal-button cancel-button'
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

      {/* Book Details Modal */}
      {isBookDetailsModalOpen && selectedBook && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <h2 className='modal-title'>Book Details</h2>
            <div className='book-details-content'>
              <p>
                <strong>Name:</strong> {selectedBook.name}
              </p>
              <p>
                <strong>Description:</strong> {selectedBook.description}
              </p>
              <p>
                <strong>ID:</strong> {selectedBook.id}
              </p>
            </div>
            <div className='modal-actions'>
              <button
                className='modal-button cancel-button'
                onClick={() => {
                  setIsBookDetailsModalOpen(false);
                  setSelectedBook(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookTable;

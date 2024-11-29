//BookTable.tsx
import React from 'react';
import {
    Button,
    VStack,
    Table
  } from '@chakra-ui/react';
import { useQuery, gql } from '@apollo/client';

const GET_BOOKS = gql`
  query GetBooks {
    getBooks {
      id
      name
      description
    }
  }
`;

const BookTable: React.FC = () => {
  const { loading, error, data } = useQuery(GET_BOOKS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <VStack w="full">
        <Table.Root>
          <Table.ColumnHeader>
            <Table.Row>
              <Table.Header>ID</Table.Header>
              <Table.Header>Name</Table.Header>
              <Table.Header>Description</Table.Header>
              <Table.Header>Actions</Table.Header>
            </Table.Row>
          </Table.ColumnHeader>
          <Table.Body>
            {data.getBooks.map((book: any) => (
              <Table.Row key={book.id}>
                <Table.Cell>{book.id}</Table.Cell>
                <Table.Cell>{book.name}</Table.Cell>
                <Table.Cell>{book.description}</Table.Cell>
                <Table.Cell>
                  <Button colorScheme="blue" size="sm" mr={2}>Edit</Button>
                  <Button colorScheme="red" size="sm">Delete</Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
    </VStack>
  );
};

export default BookTable;
# Book Dashboard Frontend
This project was bootstrapped with Create React App and leverages the following tools: React, Apollo Client, Chakra UI, and Auth0 to deliver a dynamic dashboard for managing a book collection.

## Overview
The dashboard allows authorized users to create, view, and manage a list of books. It integrates Auth0 for secure authentication and Apollo Client for seamless interaction with a GraphQL API. Chakra UI ensures a clean, responsive design.

Deployed URL: https://book-dashboard-frontend.vercel.app/

Deployment Platform : Vercel

## Available Scripts
In the project directory, you can run the following commands:

### `npm install`
Installs all the dependencies listed in the package.json file.
Run this command before starting the development server or building the app to ensure all required packages are installed.

### `npm start`
Starts the app in development mode.
Open http://localhost:3000 to view it in the browser. The app will automatically reload if you edit any files, and lint errors will appear in the console for quick debugging.

### `npm test`
Runs the test suite in interactive watch mode.
Refer to the Running Tests documentation for more details.

### `npm run build`
Creates a production build in the build folder.
React is bundled and optimized for the best performance. The output is minified, and filenames include hashes for cache busting.

See Deployment for deployment instructions.

### `npm run eject`
Warning: This action is irreversible!
Once you eject, you have full control over configuration files (like Webpack, Babel, etc.), but you must manage these manually. Use only if necessary.

## Key Technologies and Tools
React (v18.3.1): Core library for building the app's user interface.

Chakra UI (v3.2.1): Provides ready-to-use, accessible, and customizable UI components.

Apollo Client (v3.11.10): Manages GraphQL queries, caching, and local state.

Auth0 React SDK (v2.2.4): Handles authentication and user session management.

Framer Motion (v4.1.17): Adds fluid animations to enhance user experience.

TypeScript (v4.9.5): Enables static typing for better code quality and maintainability.

React Router DOM (v7.0.1): Provides routing capabilities for single-page applications.

TailwindCSS: Used alongside Chakra UI for custom utility-based styling.

## Styling
Chakra UI serves as the primary UI framework, providing an accessible and consistent design system. TailwindCSS is used for additional utility-based styling, ensuring a sleek and modern look.

## GraphQL Integration
Apollo Client connects the frontend to the GraphQL API, enabling efficient data fetching, caching, and mutation handling. Ensure the backend service is running to access book data.

## Authentication
Auth0 is integrated for secure login and user management. Upon authentication, users can access and manage the dashboard based on predefined permissions.

## Folder Structure
`src/`: Contains React components, pages, hooks, and GraphQL operations.

`public/`: Hosts static assets such as index.html.

`node_modules/`: Contains project dependencies.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

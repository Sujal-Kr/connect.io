# Connect.io

Connect.io is a web application designed to facilitate real-time communication between users. It features a client-side application built with React and a server-side application built with Node.js.

## Features

- Real-time messaging
- User authentication
- User profile management
- Group chat functionality
- Notifications
- Responsive design

## Endpoints

### Authentication

- `POST /api/user/login` - Login a user
- `POST /api/user/signup` - Register a new user
- `GET /api/user/logout` - Logout a user

### User

- `GET /api/user/profile` - Get user profile
- `GET /api/user/search` - Search for users
- `POST /api/user/sendrequest` - Send a friend request
- `PATCH /api/user/acceptrequest` - Accept a friend request
- `GET /api/user/notifications` - Get user notifications
- `GET /api/user/friends` - Get user's friends list

### Admin

- `POST /api/admin/verify` - Verify admin credentials
- `GET /api/admin/logout` - Logout admin
- `GET /api/admin` - Get admin data
- `GET /api/admin/users` - Get all users
- `GET /api/admin/chats` - Get all chats
- `GET /api/admin/messages` - Get all messages
- `GET /api/admin/stats` - Get dashboard statistics

### Chat

- `POST /api/chat/create` - Create a new group chat
- `GET /api/chat/me` - Get user's chats
- `GET /api/chat/me/groups` - Get user's group chats
- `PATCH /api/chat/addmembers` - Add members to a group chat
- `PATCH /api/chat/removemember` - Remove a member from a group chat
- `DELETE /api/chat/leave/:id` - Leave a group chat
- `POST /api/chat/message` - Send a message with attachments
- `GET /api/chat/message/:id` - Get messages in a chat
- `GET /api/chat/:id` - Get chat details
- `PATCH /api/chat/:id` - Rename a group chat
- `DELETE /api/chat/:id` - Delete a chat


## Best Practices

- Used environment variables for configuration. Refer to the `.env` file for the required variables.
- Keep your code modular and organized. Use the provided directory structure to place your files.
- Implemented custom API error handling to provide meaningful error messages and status codes.
- Used a global try-catch block to handle unexpected errors and ensure the application does not crash.
- Utilized API error middleware to centralize error handling and improve code maintainability.
- Performed input validation using `express-validator` to ensure data integrity and security.

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Steps

1. Clone the repository:
    ```sh
    git clone https://github.com/sujal-kr/connect.io.git
    cd connect.io
    ```

2. Install dependencies for the client:
    ```sh
    cd client
    npm install
    ```

3. Install dependencies for the server:
    ```sh
    cd ../server
    npm install
    ```

4. Set up environment variables:
    - Create a `.env` file in both the `client` and `server` directories.
    - Add the necessary environment variables as specified in the `.env.example` files.

5. Start the development servers:
    - Client:
        ```sh
        cd client
        npm run dev
        ```
    - Server:
        ```sh
        cd ../server
        npm start
        ```

6. Open your browser and navigate to `http://localhost:5173` to access the application.

## Contributing

We welcome contributions! Please read our contributing guidelines for more information.


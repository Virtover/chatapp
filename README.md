# Group Chat Application

This application is a group chat implemented using FastAPI and React. It is composed of four microservices:

1. **API Gateway Service**: The API Gateway service acts as the entry point for the application and handles the routing to the appropriate microservices.
2. **Frontend Service**: The Frontend service provides the user interface for the group chat application. It is responsible for rendering the chat interface, sending and receiving messages, and displaying user information.
3. **Users Service**: The Users service handles user-related operations, such as user authentication, user registration, and user profile management. It stores user information in a PostgreSQL database.
4. **Messages Service**: The Messages service manages the storage and retrieval of chat messages. It communicates with other services asynchronously using web sockets for real-time message updates.


## Architecture

The group chat application follows a microservices architecture, where each microservice is responsible for a specific set of functionalities. This architecture provides flexibility, scalability, and modularity to the application.

The API Gateway service acts as an entry point, allowing clients to interact with the application without needing to know the internal details of each microservice. It handles authentication, authorization, and routes requests to the appropriate microservice based on the requested endpoint.

The Frontend service is built with React, providing a responsive and user-friendly interface for users to interact with the group chat application. It communicates with the backend microservices through API calls to send and receive messages, authenticate users, and manage user profiles.

The Users service handles user-related operations. It stores user information in a PostgreSQL database and provides APIs for user registration, login, logout, and updating user profiles. User's informations are fetched synchronously from the DB running in a container.

The Messages service is responsible for chat messages. It provides APIs for sending messages and retrieving chat history. It is based on asynchronous WebSocket communication.

## Getting Started

To run the group chat application locally, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Run `docker compose build --no-cache` and then `docker compose up`

The site will be available at localhost:3000

## License

This project is licensed under the [MIT License](LICENSE).

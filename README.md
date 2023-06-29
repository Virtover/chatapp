# Group Chat Application

This application is a group chat implemented using FastAPI and React. It is composed of four microservices:

1. **API Gateway Service**: The API Gateway service acts as the entry point for the application and handles the routing and load balancing of incoming requests to the appropriate microservices.
2. **Frontend Service**: The Frontend service provides the user interface for the group chat application. It is responsible for rendering the chat interface, sending and receiving messages, and displaying user information.
3. **Users Service**: The Users service handles user-related operations, such as user authentication, user registration, and user profile management. It stores user information in a PostgreSQL database.
4. **Messages Service**: The Messages service manages the storage and retrieval of chat messages. It stores the messages in a PostgreSQL database and provides API endpoints for sending, retrieving, and managing messages.

## Architecture

The group chat application follows a microservices architecture, where each microservice is responsible for a specific set of functionalities. This architecture provides flexibility, scalability, and modularity to the application.

The API Gateway service acts as a single entry point, allowing clients to interact with the application without needing to know the internal details of each microservice. It handles authentication, authorization, and routes requests to the appropriate microservice based on the requested endpoint.

The Frontend service is built with React, providing a responsive and user-friendly interface for users to interact with the group chat application. It communicates with the backend microservices through API calls to send and receive messages, authenticate users, and manage user profiles.

The Users service handles user-related operations, including user registration, authentication, and profile management. It stores user information in a PostgreSQL database and provides APIs for user registration, login, logout, and updating user profiles.

The Messages service is responsible for storing and retrieving chat messages. It manages the persistence of messages in a PostgreSQL database and provides APIs for sending messages, retrieving chat history, and managing messages.

## Getting Started

To run the group chat application locally, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Install the necessary dependencies for each microservice.
3. Configure the environment variables for each microservice, including database connections and service URLs.
4. Start each microservice individually.
5. Access the frontend service through the provided URL and start using the group chat application.

Please refer to the individual microservice directories for more detailed instructions on setting up and running each service.

## Contributing

We welcome contributions to the group chat application! If you would like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Implement your changes and ensure all tests pass.
4. Commit and push your changes to your forked repository.
5. Submit a pull request detailing your changes and their purpose.

Please make sure to follow the code style guidelines and provide tests for any new features or bug fixes.

## License

This project is licensed under the [MIT License](LICENSE).

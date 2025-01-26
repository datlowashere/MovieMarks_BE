# MovieMarks Backend

**MovieMarks_BE** is the backend service for the [MovieMarks](https://github.com/datlowashere/MovieMarks) application. It provides RESTful APIs for managing movies, user data, bookmarks, and other functionalities. The backend is built with Node.js, Express.js, and MongoDB, ensuring scalability and performance.

## Technologies Used

Below are the libraries and tools utilized in the project, along with their roles:

#### Backend Frameworks and Tools
- **express**: A fast and lightweight Node.js framework for building web applications and APIs.
- **http**: HTTP utilities for Node.js (part of Node's core modules).

#### Authentication and Security
- **jsonwebtoken**: A library for creating and verifying JSON Web Tokens (JWT) for secure user authentication.
- **bcrypt**: A library for hashing passwords to enhance security.
- **bcryptjs**: An alternative library for password hashing.

#### Database and ORM
- **mongoose**: A MongoDB object modeling tool to work with the database using schemas and models.

#### File and Media Handling
- **multer**: Middleware for handling multipart/form-data, primarily for file uploads.
- **cloudinary**: A cloud-based service for image and video management and transformations.

#### API Documentation
- **swagger-jsdoc**: A tool to generate Swagger/OpenAPI specification documentation from code.
- **swagger-ui-express**: Middleware to serve and display API documentation in an interactive UI.

#### Utilities
- **dotenv**: Loads environment variables from a `.env` file into `process.env`.
- **body-parser**: Middleware for parsing incoming request bodies in JSON or URL-encoded format.

#### Email Services
- **nodemailer**: A library for sending emails using Node.js.

#### Development Tools
- **nodemon**: Automatically restarts the application when file changes are detected during development.

#### Node.js Versioning and Package Management
- **package.json**: Metadata about the project and its dependencies.
- **package-lock.json**: Locks the exact version of dependencies to ensure consistent installs.

## Project Structure
The folder struture we built in this project based on [MVC architecture](https://www.geeksforgeeks.org/mvc-framework-introduction/).

```plaintext

MovieMarkBE/
├── node_modules/          # Contains all Node.js dependencies
├── public/                # Static files such as images, CSS, and JavaScript
├── src/                   # Source code of the application
│   ├── app/               # Main application directory
│       ├── controllers/   # Handles requests and business logic
│       ├── models/        # Database schema and models
│   ├── config/            # Application configurations
│   ├── middlewares/       # Middleware functions for request processing
│   ├── resources/         # Static or shared resources (e.g., localization files, templates)
│   ├── routers/           # Route definitions and API endpoint mappings
│   ├── utils/             # Utility functions and helpers
│   └── views/             # Views and templates for server-side rendering
├── .env                   # Environment variables configuration file
├── .env.example           # Example environment file with placeholder values
├── .gitignore             # Specifies files and directories to be ignored by Git
├── index.js               # Main entry point of the application
├── package-lock.json      # Auto-generated file for locking dependency versions
├── package.json           # Defines project metadata and dependencies
└── README.md              # Documentation file for the project

```
---
## Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/try/download/community) (local or cloud instance)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/datlowashere/MovieMarks_BE.git
   ```

2. Navigate to the project directory:
   ```bash
   cd MovieMarks_BE
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and configure the required environment variables. You can refer to the variables in the ```.env.example``` file:
   ```env
   PORT=3000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-secret-key>
   ```

5. Start the development server:
   ```bash
   npm start
   ```
   or
   ```bash
   nodemon index.js
   ```
7. The API server will be running on `http://localhost:3000`. Or you can also test the APIs using Swagger at the endpoint. `http://localhost:3000/api-docs`


## Development Scripts

- **Start Development Server**:
  ```bash
  npm run dev
  ```

- **Run Tests**:
  ```bash
  npm test
  ```

- **Lint Code**:
  ```bash
  npm run lint
  ```

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact


This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Inspired by movie enthusiasts and developers worldwide.
- Thanks to the Flutter community for providing guidance and tools.
- Thanks to the Node.js and MongoDB communities for backend support.

## Contact

If you have any questions or feedback, feel free to contact me:

- GitHub: [@datlowashere](https://github.com/datlowashere)

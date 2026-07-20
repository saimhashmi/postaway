# Postaway-II

## RESTful API using Node.js, ExpressJS, and MongoDB for efficient data handling and routing control.

Postaway is a full-featured social media backend API that provides account management, content publishing, social interactions, and secure authentication flows. The project is organized using a feature-based folder structure and follows a typical MVC-style pattern with routes, controllers, repositories, schemas, and middleware.

## Project Overview

This backend allows users to:

- Sign up, sign in, verify their email, and log out
- Manage their profile details and avatar information
- Create, view, update, and delete posts
- Comment on posts and update or remove comments
- Like posts and comments
- Send, accept, or reject friend requests
- Request OTPs, verify them, and reset passwords

The API is designed to be used by a frontend client or tested directly through tools such as Postman or Swagger UI.

## Main Features

- User authentication and authorization using JWT
- Email verification and welcome email flow
- File upload support for post images and avatar-related assets
- Input validation for user, post, and comment data
- Centralized error handling and route fallback handling
- Swagger/OpenAPI documentation for all available endpoints

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (JSON Web Tokens)
- Cookie-based authentication support
- Multer for file uploads
- Swagger UI for API documentation
- Nodemailer for email delivery

## Project Architecture

The project is structured around feature folders under the `src` directory:

- `src/features/Users` – user signup, signin, verification, profile management, logout, and token handling
- `src/features/Posts` – post CRUD operations and image handling
- `src/features/Comments` – comment creation, update, and deletion
- `src/features/Likes` – like and unlike operations for posts/comments
- `src/features/Friends` – friend request and friendship management
- `src/features/Otp` – OTP delivery, verification, and password reset
- `src/middlewares` – authentication, validation, logging, file upload, error handling, and route fallback
- `src/config` – database connection setup
- `src/service` – email services
- `src/utils` – shared helpers, path utilities, templates, and error classes
- `src/swagger` – Swagger/OpenAPI configuration and documentation UI

## Installation

1. Clone the repository.
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a `.env` file in the project root with the required environment variables:
    ```env
    MONGODB=mongodb://127.0.0.1:27017/Postaway
    JWT_SECRET=your_secret_key
    ```

You may also need to ensure your MongoDB server is running locally before starting the app.

## Running the Server

Start the application with:

```bash
npm start
```

The server will run on:

- http://localhost:3000/

## API Documentation

Swagger documentation is available at:

- http://localhost:3000/api-docs/

The Swagger UI provides a visual interface to browse all API endpoints, view request parameters, and understand the expected payloads.

## API Routes Overview

The backend exposes routes under the following base paths:

- `/api/users` – authentication, profile, email verification, and logout
- `/api/posts` – post listing, creation, retrieval, update, and deletion
- `/api/comments` – comments for posts
- `/api/likes` – likes for posts and comments
- `/api/friends` – friend requests and friend list management
- `/api/otp` – OTP sending, verification, and password reset

## Notes

- Some routes require JWT authentication and may use either a bearer token or a cookie-based JWT.
- File upload routes expect multipart form data for images.
- The project uses centralized error responses to keep the API behavior consistent.

# Postaway-II

**Score:** 0/600

## Objective

### Goal

Develop a robust social media backend REST-API that empowers users to post, comment, like, send friend requests, and reset their passwords using OTP for enhanced security.

### Acceptance Criteria

**RESTful Architecture**

- Develop a RESTful API using Node.js, ExpressJS, and MongoDB for efficient data handling and routing control.

**Code Modularity**

- Organize code using ES6 Modules for maintainability and modularity.

**User Authentication**

- Implement a user authentication system with essential features like signup, login, and logout. Moreover, you have the opportunity to earn extra marks for implementing an advanced feature: the ability to log out from all devices. To achieve this, consider storing each login token in an additional array field within the user's document.
- Registration should include user details such as name, email, password, and gender. Additional fields can be included as needed.

**Post Management**

- Implement CRUD operations for posts, including fields like caption and an image URL related to the post.
- Ensure that each post references the user who created it.
- Post can be updated or deleted only by the post owner.

**Comment System**

- Develop a comment system that allows users to add, update, and delete comments on posts.
- Comments can be updated or deleted only by the post owner or the commenter.

**Like Functionality**

- Create a like system for posts, including logic with MongoDB and population of documents.
- Display counts of likes and comments on posts.
- Populate user information (id, name, and email) for likes, comments, and posts.

**Friendship Features**

- Implement a friendship system with features like getting user friends, managing pending friend requests, toggling friendships, and accepting/rejecting friend requests.

**User Profile Updates**

- Enable users to update their profiles, including fields like name, gender, or avatar.
- Implement avatar uploads for user profiles.

**OTP-Based Password Reset (Additional Task)**

- OTP-based password reset feature. Create controllers, models, and repositories for OTP management.
- You can use the Nodemailer library for email communication.

---

## Tasks

**Project Setup**

- Set up an Express.js application and configure related settings.

**Dependency Installation**

- Install the necessary project dependencies based on the required functionalities.

**User Authentication**

- Implement user registration and login routes.
- Develop user logout routes.

**User Profile**

- Create routes for getting user details and updating user profiles.
- Implement avatar uploads.

**Post Management**

- Set up routes and controllers for CRUD operations on posts.
- Handle image uploads for post images.

**Comment System**

- Develop routes and controllers for managing comments on posts.

**Like Functionality**

- Create routes and logic for liking and unliking posts and comments.

**Friendship Features**

- Implement routes and controllers for user friendships, including getting friends, and accepting/rejecting requests.

**OTP-Based Password Reset**

- Set up routes and controllers for sending OTPs, verifying OTPs, and resetting passwords.

**Error Handling and Logging**

- Implement error handling middleware and request logging.

**Testing and Documentation**

- Thoroughly test the API to ensure it meets acceptance criteria.
- Document the application's functionalities, dependencies, and code organization for clarity.

---

## API Structure

### Authentication Routes

- `POST /api/users/signup` — Register a new user account.
- `POST /api/users/signin` — Log in as a user.
- `POST /api/users/logout` — Log out the currently logged-in user.
- `POST /api/users/logout-all-devices` — Log out the user from all devices.

### User Profile Routes

- `GET /api/users/get-details/:userId` — Retrieve user information, ensuring sensitive data like passwords is not exposed.
- `GET /api/users/get-all-details` — Retrieve information for all users, avoiding display of sensitive credentials like passwords.
- `PUT /api/users/update-details/:userId` — Update user details while ensuring that sensitive data like passwords remains secure and undisclosed.

### Post Routes

- `GET /api/posts/all` — Retrieve all posts from various users to compile a news feed.
- `GET /api/posts/:postId` — Retrieve a specific post by ID.
- `GET /api/posts/` — Retrieve all posts for a specific user to display on their profile page.
- `POST /api/posts/` — Create a new post.
- `DELETE /api/posts/:postId` — Delete a specific post.
- `PUT /api/posts/:postId` — Update a specific post.

> Note: for the same routes, you can change the HTTP methods (GET, POST, PUT, DELETE) — the route stays the same, only the method changes.

### Comment Routes

- `GET /api/comments/:postId` — Get comments for a specific post.
- `POST /api/comments/:postId` — Add a comment to a specific post.
- `DELETE /api/comments/:commentId` — Delete a specific comment.
- `PUT /api/comments/:commentId` — Update a specific comment.

### Like Routes

- `GET /api/likes/:id` — Get likes for a specific post or comment.
- `POST /api/likes/toggle/:id` — Toggle like on a post or comment.

### Friendship Routes

- `GET /api/friends/get-friends/:userId` — Get a user's friends.
- `GET /api/friends/get-pending-requests` — Get pending friend requests.
- `POST /api/friends/toggle-friendship/:friendId` — Toggle friendship with another user.
- `POST /api/friends/response-to-request/:friendId` — Accept or reject a friend request.

### OTP Routes

- `POST /api/otp/send` — Send an OTP for password reset.
- `POST /api/otp/verify` — Verify an OTP.
- `POST /api/otp/reset-password` — Reset the user's password.

### Postman Collection

[Link to the Postman collection](https://www.postman.com/descent-module-specialist-28289611/workspace/postaway/collection/37224711-9ad78218-5999-4782-a621-b08a116c9781?action=share&creator=37224711)

Steps:

1. Click the URL for the collection.
2. Ensure you are logged in using your Postman credentials.
3. Fork this collection and proceed further to test your application.

> Note: Don't forget to change the parameters (ObjectId, postId, commentId, etc.) wherever necessary.

---

## Evaluation Parameters

| Parameter                                    | Max Score |
| -------------------------------------------- | --------- |
| Express.js, Mongoose & MongoDB Setup         | 50        |
| Code Modularity and Organization             | 100       |
| User Authentication                          | 100       |
| Post Management and Comment System           | 75        |
| Like Functionality and Populated Data        | 75        |
| Friendship Features and User Profile Updates | 50        |
| OTP-Based Password Reset                     | 50        |
| Additional Tasks                             | 50        |
| Innovation                                   | 50        |
| **Total**                                    | **600**   |

**Details:**

- **Express.js, Mongoose & MongoDB Setup** — Implements Express.js using MVC architecture with ES6 Modules for modularity, separating data handling, interface rendering, and routing control. Configures Mongoose for efficient MongoDB interaction.
- **Code Modularity and Organization** — Well-structured and modular code for clarity and maintainability, adhering to naming conventions and best practices, with thorough comments and documentation.
- **User Authentication** — Secure and robust authentication system with registration, login, and logout, applying necessary security measures to protect user credentials and sessions.
- **Post Management and Comment System** — Functional post management (create, edit, delete) with an integrated comment system supporting commenting and comment management.
- **Like Functionality and Populated Data** — 'Like' functionality for posts/comments, with data properly populated and displayed for a seamless user experience.
- **Friendship Features and User Profile Updates** — User connection features (adding friends/following) and profile updates with relevant information and preferences.
- **OTP-Based Password Reset** — Secure OTP-based password reset mechanism with a user-friendly, reliable process.
- **Additional Tasks** — Successful completion of all additional tasks specified for the project.
- **Innovation** — Creative use of Node.js/Express.js features, performance optimization best practices, and creative UI/UX with minimal reliance on external dependencies.

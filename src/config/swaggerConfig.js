export const swaggerSpec = {
	openapi: "3.0.4",
	info: {
		title: "Postaway API",
		version: "1.0.0",
		description:
			"Complete REST API documentation for the Postaway social media backend. It covers users, posts, comments, likes, friendships, and OTP-based account flows.",
		contact: {
			name: "Azathoth",
			email: "support@postaway.local",
		},
	},
	servers: [
		{
			url: "http://localhost:3000",
			description: "Local development server",
		},
	],
	tags: [
		{
			name: "Users",
			description:
				"Account registration, authentication, profile management, and email verification",
		},
		{
			name: "Posts",
			description: "Create, read, update, and delete posts",
		},
		{
			name: "Comments",
			description: "Comment on posts and manage comment content",
		},
		{
			name: "Likes",
			description: "Like and unlike posts or comments",
		},
		{
			name: "Friends",
			description:
				"Friend requests, pending requests, and friendship toggling",
		},
		{
			name: "OTP",
			description: "OTP delivery, verification, and password reset",
		},
	],
	security: [{ bearerAuth: [] }, { cookieAuth: [] }],
	paths: {
		"/api/users/signup": {
			post: {
				tags: ["Users"],
				summary: "Register a new user",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/UserSignupInput",
							},
						},
					},
				},
				responses: {
					201: {
						description: "User registered successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/SuccessResponse",
								},
							},
						},
					},
					400: { $ref: "#/components/responses/ValidationError" },
					409: { $ref: "#/components/responses/ConflictError" },
				},
			},
		},
		"/api/users/signin": {
			post: {
				tags: ["Users"],
				summary: "Sign in an existing user",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/UserSigninInput",
							},
						},
					},
				},
				responses: {
					200: {
						description: "Authentication successful",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/AuthSuccessResponse",
								},
							},
						},
					},
					401: { $ref: "#/components/responses/UnauthorizedError" },
				},
			},
		},
		"/api/users/logout": {
			post: {
				tags: ["Users"],
				summary: "Log out the current user",
				security: [{ bearerAuth: [] }, { cookieAuth: [] }],
				responses: {
					200: {
						description: "Logout successful",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/SuccessResponse",
								},
							},
						},
					},
					401: { $ref: "#/components/responses/UnauthorizedError" },
				},
			},
		},
		"/api/users/logout-all-devices": {
			post: {
				tags: ["Users"],
				summary: "Log out the current user from all devices",
				security: [{ bearerAuth: [] }, { cookieAuth: [] }],
				responses: {
					200: {
						description: "Logged out from all devices",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/SuccessResponse",
								},
							},
						},
					},
					401: { $ref: "#/components/responses/UnauthorizedError" },
				},
			},
		},
		"/api/users/get-details/{userId}": {
			get: {
				tags: ["Users"],
				summary: "Get a user profile by ID",
				security: [{ bearerAuth: [] }, { cookieAuth: [] }],
				parameters: [{ $ref: "#/components/parameters/UserIdParam" }],
				responses: {
					200: {
						description: "User fetched successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/UserDetailsResponse",
								},
							},
						},
					},
					404: { $ref: "#/components/responses/NotFoundError" },
				},
			},
		},
		"/api/users/get-all-details": {
			get: {
				tags: ["Users"],
				summary: "Get all users",
				security: [{ bearerAuth: [] }, { cookieAuth: [] }],
				responses: {
					200: {
						description: "User list fetched successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/UsersListResponse",
								},
							},
						},
					},
				},
			},
		},
		"/api/users/verify-email": {
			get: {
				tags: ["Users"],
				summary: "Verify a user email address",
				parameters: [
					{ $ref: "#/components/parameters/VerificationTokenParam" },
				],
				responses: {
					200: {
						description: "Email verified successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/SuccessResponse",
								},
							},
						},
					},
					400: { $ref: "#/components/responses/ValidationError" },
				},
			},
		},
		"/api/users/update-details/{userId}": {
			put: {
				tags: ["Users"],
				summary: "Update user profile details",
				security: [{ bearerAuth: [] }, { cookieAuth: [] }],
				parameters: [{ $ref: "#/components/parameters/UserIdParam" }],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/UserUpdateInput",
							},
						},
					},
				},
				responses: {
					200: {
						description: "User updated successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/SuccessResponse",
								},
							},
						},
					},
					401: { $ref: "#/components/responses/UnauthorizedError" },
				},
			},
		},
		"/api/posts/all": {
			get: {
				tags: ["Posts"],
				summary: "Get all posts",
				security: [{ bearerAuth: [] }, { cookieAuth: [] }],
				responses: {
					200: {
						description: "List of posts",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/PostsListResponse",
								},
							},
						},
					},
					404: { $ref: "#/components/responses/NotFoundError" },
				},
			},
		},
		"/api/posts/{postId}": {
			get: {
				tags: ["Posts"],
				summary: "Get one post by ID",
				security: [{ bearerAuth: [] }, { cookieAuth: [] }],
				parameters: [{ $ref: "#/components/parameters/PostIdParam" }],
				responses: {
					200: {
						description: "Post fetched successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/PostResponse",
								},
							},
						},
					},
					404: { $ref: "#/components/responses/NotFoundError" },
				},
			},
			delete: {
				tags: ["Posts"],
				summary: "Delete a post",
				security: [{ bearerAuth: [] }, { cookieAuth: [] }],
				parameters: [{ $ref: "#/components/parameters/PostIdParam" }],
				responses: {
					200: {
						description: "Post deleted successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/SuccessResponse",
								},
							},
						},
					},
					401: { $ref: "#/components/responses/UnauthorizedError" },
					404: { $ref: "#/components/responses/NotFoundError" },
				},
			},
			put: {
				tags: ["Posts"],
				summary: "Update a post",
				security: [{ bearerAuth: [] }, { cookieAuth: [] }],
				parameters: [{ $ref: "#/components/parameters/PostIdParam" }],
				requestBody: {
					required: true,
					content: {
						"multipart/form-data": {
							schema: {
								$ref: "#/components/schemas/PostUpdateInput",
							},
						},
					},
				},
				responses: {
					200: {
						description: "Post updated successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/PostResponse",
								},
							},
						},
					},
					404: { $ref: "#/components/responses/NotFoundError" },
				},
			},
		},
		"/api/posts/user/{userId}": {
			get: {
				tags: ["Posts"],
				summary: "Get posts by a specific user",
				security: [{ bearerAuth: [] }, { cookieAuth: [] }],
				parameters: [{ $ref: "#/components/parameters/UserIdParam" }],
				responses: {
					200: {
						description: "Posts fetched successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/PostsListResponse",
								},
							},
						},
					},
					404: { $ref: "#/components/responses/NotFoundError" },
				},
			},
		},
		"/api/posts": {
			post: {
				tags: ["Posts"],
				summary: "Create a new post",
				security: [{ bearerAuth: [] }, { cookieAuth: [] }],
				requestBody: {
					required: true,
					content: {
						"multipart/form-data": {
							schema: {
								$ref: "#/components/schemas/PostCreateInput",
							},
						},
					},
				},
				responses: {
					201: {
						description: "Post created successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/PostResponse",
								},
							},
						},
					},
					400: { $ref: "#/components/responses/ValidationError" },
				},
			},
		},
		"/api/comments/{postId}": {
			get: {
				tags: ["Comments"],
				summary: "Get comments for a specific post",
				security: [{ bearerAuth: [] }, { cookieAuth: [] }],
				parameters: [{ $ref: "#/components/parameters/PostIdParam" }],
				responses: {
					200: {
						description: "Comments fetched successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/CommentsListResponse",
								},
							},
						},
					},
					404: { $ref: "#/components/responses/NotFoundError" },
				},
			},
			post: {
				tags: ["Comments"],
				summary: "Create a comment for a post",
				security: [{ bearerAuth: [] }, { cookieAuth: [] }],
				parameters: [{ $ref: "#/components/parameters/PostIdParam" }],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/CommentCreateInput",
							},
						},
					},
				},
				responses: {
					201: {
						description: "Comment created successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/CommentResponse",
								},
							},
						},
					},
					400: { $ref: "#/components/responses/ValidationError" },
				},
			},
		},
		"/api/comments/{commentId}": {
			delete: {
				tags: ["Comments"],
				summary: "Delete a comment",
				security: [{ bearerAuth: [] }, { cookieAuth: [] }],
				parameters: [
					{ $ref: "#/components/parameters/CommentIdParam" },
				],
				responses: {
					200: {
						description: "Comment deleted successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/CommentResponse",
								},
							},
						},
					},
					404: { $ref: "#/components/responses/NotFoundError" },
				},
			},
			put: {
				tags: ["Comments"],
				summary: "Update a comment",
				security: [{ bearerAuth: [] }, { cookieAuth: [] }],
				parameters: [
					{ $ref: "#/components/parameters/CommentIdParam" },
				],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/CommentUpdateInput",
							},
						},
					},
				},
				responses: {
					200: {
						description: "Comment updated successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/CommentResponse",
								},
							},
						},
					},
					404: { $ref: "#/components/responses/NotFoundError" },
				},
			},
		},
		"/api/likes/{Id}": {
			get: {
				tags: ["Likes"],
				summary: "Get likes for a post or comment",
				security: [{ bearerAuth: [] }, { cookieAuth: [] }],
				parameters: [
					{ $ref: "#/components/parameters/LikeIdParam" },
					{ $ref: "#/components/parameters/LikeTypeParam" },
				],
				responses: {
					200: {
						description: "Likes fetched successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/LikesResponse",
								},
							},
						},
					},
					404: { $ref: "#/components/responses/NotFoundError" },
				},
			},
		},
		"/api/likes/toggle/{Id}": {
			post: {
				tags: ["Likes"],
				summary: "Toggle a like for a post or comment",
				security: [{ bearerAuth: [] }, { cookieAuth: [] }],
				parameters: [
					{ $ref: "#/components/parameters/LikeIdParam" },
					{ $ref: "#/components/parameters/LikeTypeParam" },
				],
				responses: {
					200: {
						description: "Like toggled successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/LikeToggleResponse",
								},
							},
						},
					},
				},
			},
		},
		"/api/friends/get-friends/{userId}": {
			get: {
				tags: ["Friends"],
				summary: "Get a user's friend list",
				security: [{ bearerAuth: [] }, { cookieAuth: [] }],
				parameters: [{ $ref: "#/components/parameters/UserIdParam" }],
				responses: {
					200: {
						description: "Friend list fetched successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/FriendsResponse",
								},
							},
						},
					},
					404: { $ref: "#/components/responses/NotFoundError" },
				},
			},
		},
		"/api/friends/get-pending-requests": {
			get: {
				tags: ["Friends"],
				summary: "Get pending friend requests for the logged in user",
				security: [{ bearerAuth: [] }, { cookieAuth: [] }],
				responses: {
					200: {
						description: "Pending requests fetched successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/FriendsResponse",
								},
							},
						},
					},
					404: { $ref: "#/components/responses/NotFoundError" },
				},
			},
		},
		"/api/friends/toggle-friendship/{friendId}": {
			post: {
				tags: ["Friends"],
				summary: "Send or cancel a friend request",
				security: [{ bearerAuth: [] }, { cookieAuth: [] }],
				parameters: [{ $ref: "#/components/parameters/FriendIdParam" }],
				responses: {
					200: {
						description: "Friendship toggled successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/FriendsResponse",
								},
							},
						},
					},
					400: { $ref: "#/components/responses/ValidationError" },
				},
			},
		},
		"/api/friends/response-to-request/{friendId}": {
			post: {
				tags: ["Friends"],
				summary: "Accept or reject a friend request",
				security: [{ bearerAuth: [] }, { cookieAuth: [] }],
				parameters: [{ $ref: "#/components/parameters/FriendIdParam" }],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									accept: {
										type: "boolean",
										description:
											"Whether to accept the request",
										default: false,
									},
								},
							},
						},
					},
				},
				responses: {
					200: {
						description: "Friend request response recorded",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/FriendsResponse",
								},
							},
						},
					},
				},
			},
		},
		"/api/otp/send": {
			post: {
				tags: ["OTP"],
				summary: "Send an OTP to an email address",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/OtpSendInput",
							},
						},
					},
				},
				responses: {
					200: {
						description: "OTP sent successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/SuccessResponse",
								},
							},
						},
					},
					400: { $ref: "#/components/responses/ValidationError" },
				},
			},
		},
		"/api/otp/verify": {
			post: {
				tags: ["OTP"],
				summary: "Verify an OTP",
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/OtpVerifyInput",
							},
						},
					},
				},
				responses: {
					200: {
						description: "OTP verified successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/AuthSuccessResponse",
								},
							},
						},
					},
					400: { $ref: "#/components/responses/ValidationError" },
				},
			},
		},
		"/api/otp/reset-password": {
			post: {
				tags: ["OTP"],
				summary: "Reset a user's password",
				security: [{ bearerAuth: [] }, { cookieAuth: [] }],
				requestBody: {
					required: true,
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/PasswordResetInput",
							},
						},
					},
				},
				responses: {
					200: {
						description: "Password reset successfully",
						content: {
							"application/json": {
								schema: {
									$ref: "#/components/schemas/SuccessResponse",
								},
							},
						},
					},
					401: { $ref: "#/components/responses/UnauthorizedError" },
				},
			},
		},
	},
	components: {
		securitySchemes: {
			bearerAuth: {
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
			},
			cookieAuth: {
				type: "apiKey",
				in: "cookie",
				name: "jwtToken",
			},
		},
		parameters: {
			UserIdParam: {
				name: "userId",
				in: "path",
				required: true,
				description: "MongoDB user ID",
				schema: { type: "string" },
			},
			PostIdParam: {
				name: "postId",
				in: "path",
				required: true,
				description: "MongoDB post ID",
				schema: { type: "string" },
			},
			CommentIdParam: {
				name: "commentId",
				in: "path",
				required: true,
				description: "MongoDB comment ID",
				schema: { type: "string" },
			},
			FriendIdParam: {
				name: "friendId",
				in: "path",
				required: true,
				description: "MongoDB user ID of the target friend",
				schema: { type: "string" },
			},
			LikeIdParam: {
				name: "Id",
				in: "path",
				required: true,
				description: "ID of the liked item (post or comment)",
				schema: { type: "string" },
			},
			LikeTypeParam: {
				name: "type",
				in: "query",
				required: false,
				description:
					"The type of the liked item. Accepted values: Post, Comment",
				schema: {
					type: "string",
					enum: ["Post", "Comment"],
				},
			},
			VerificationTokenParam: {
				name: "token",
				in: "query",
				required: true,
				description: "Email verification JWT",
				schema: { type: "string" },
			},
		},
		responses: {
			ValidationError: {
				description: "Validation error",
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/ValidationErrorResponse",
						},
					},
				},
			},
			UnauthorizedError: {
				description: "Authentication failed",
				content: {
					"application/json": {
						schema: { $ref: "#/components/schemas/ErrorResponse" },
					},
				},
			},
			NotFoundError: {
				description: "Resource not found",
				content: {
					"application/json": {
						schema: { $ref: "#/components/schemas/ErrorResponse" },
					},
				},
			},
			ConflictError: {
				description: "Resource already exists",
				content: {
					"application/json": {
						schema: { $ref: "#/components/schemas/ErrorResponse" },
					},
				},
			},
		},
		schemas: {
			UserSignupInput: {
				type: "object",
				required: ["name", "email", "password", "gender"],
				properties: {
					name: { type: "string", minLength: 3 },
					email: { type: "string", format: "email" },
					password: { type: "string", minLength: 8 },
					gender: {
						type: "string",
						enum: ["Male", "Female", "Others"],
					},
				},
			},
			UserSigninInput: {
				type: "object",
				required: ["email", "password"],
				properties: {
					email: { type: "string", format: "email" },
					password: { type: "string" },
				},
			},
			UserUpdateInput: {
				type: "object",
				properties: {
					avatar: {
						type: "string",
						description: "Avatar URL or relative path",
					},
					name: { type: "string" },
					gender: {
						type: "string",
						enum: ["Male", "Female", "Others"],
					},
				},
			},
			PostCreateInput: {
				type: "object",
				required: ["caption"],
				properties: {
					caption: { type: "string" },
					imageUrl: {
						type: "string",
						description:
							"Optional image URL if you are not uploading a file",
					},
					image: {
						type: "string",
						format: "binary",
						description: "Optional image upload file",
					},
				},
			},
			PostUpdateInput: {
				type: "object",
				properties: {
					caption: { type: "string" },
					imageUrl: { type: "string" },
					image: { type: "string", format: "binary" },
				},
			},
			CommentCreateInput: {
				type: "object",
				required: ["content"],
				properties: {
					content: { type: "string" },
				},
			},
			CommentUpdateInput: {
				type: "object",
				required: ["content"],
				properties: {
					content: { type: "string" },
				},
			},
			OtpSendInput: {
				type: "object",
				required: ["email"],
				properties: {
					email: { type: "string", format: "email" },
				},
			},
			OtpVerifyInput: {
				type: "object",
				required: ["email", "otp"],
				properties: {
					email: { type: "string", format: "email" },
					otp: { type: "string" },
				},
			},
			PasswordResetInput: {
				type: "object",
				required: ["email", "password"],
				properties: {
					email: { type: "string", format: "email" },
					password: { type: "string", minLength: 8 },
				},
			},
			User: {
				type: "object",
				properties: {
					_id: { type: "string" },
					avatar: { type: "string" },
					name: { type: "string" },
					email: { type: "string", format: "email" },
					gender: { type: "string" },
					isVerified: { type: "boolean" },
					isAdmin: { type: "boolean" },
				},
			},
			Post: {
				type: "object",
				properties: {
					_id: { type: "string" },
					userId: { type: "string" },
					caption: { type: "string" },
					imageUrl: { type: "string" },
					timeStamp: { type: "string", format: "date-time" },
				},
			},
			Comment: {
				type: "object",
				properties: {
					_id: { type: "string" },
					userId: { type: "string" },
					postId: { type: "string" },
					content: { type: "string" },
					timeStamp: { type: "string", format: "date-time" },
				},
			},
			Like: {
				type: "object",
				properties: {
					_id: { type: "string" },
					user: { type: "string" },
					likedItem: { type: "string" },
					type: { type: "string", enum: ["Post", "Comment"] },
				},
			},
			SuccessResponse: {
				type: "object",
				properties: {
					success: { type: "boolean", example: true },
					message: { type: "string" },
					data: {},
				},
			},
			AuthSuccessResponse: {
				type: "object",
				properties: {
					success: { type: "boolean", example: true },
					data: {
						type: "object",
						properties: {
							user: { type: "string" },
							JWT: { type: "string" },
						},
					},
				},
			},
			UserDetailsResponse: {
				type: "object",
				properties: {
					success: { type: "boolean", example: true },
					data: { $ref: "#/components/schemas/User" },
				},
			},
			UsersListResponse: {
				type: "object",
				properties: {
					success: { type: "boolean", example: true },
					data: {
						type: "array",
						items: { $ref: "#/components/schemas/User" },
					},
				},
			},
			PostResponse: {
				type: "object",
				properties: {
					success: { type: "boolean", example: true },
					data: { $ref: "#/components/schemas/Post" },
				},
			},
			PostsListResponse: {
				type: "object",
				properties: {
					success: { type: "boolean", example: true },
					data: {
						type: "array",
						items: { $ref: "#/components/schemas/Post" },
					},
				},
			},
			CommentResponse: {
				type: "object",
				properties: {
					success: { type: "boolean", example: true },
					data: { $ref: "#/components/schemas/Comment" },
				},
			},
			CommentsListResponse: {
				type: "object",
				properties: {
					success: { type: "boolean", example: true },
					data: {
						type: "array",
						items: { $ref: "#/components/schemas/Comment" },
					},
				},
			},
			LikesResponse: {
				type: "object",
				properties: {
					success: { type: "boolean", example: true },
					data: {
						type: "array",
						items: { $ref: "#/components/schemas/Like" },
					},
				},
			},
			LikeToggleResponse: {
				type: "object",
				properties: {
					success: { type: "boolean", example: true },
					data: { $ref: "#/components/schemas/Like" },
				},
			},
			FriendsResponse: {
				type: "object",
				properties: {
					success: { type: "boolean", example: true },
					data: {},
				},
			},
			ErrorResponse: {
				type: "object",
				properties: {
					success: { type: "boolean", example: false },
					message: { type: "string" },
					statusCode: { type: "integer" },
				},
			},
			ValidationErrorResponse: {
				type: "object",
				properties: {
					success: { type: "boolean", example: false },
					message: { type: "string" },
					errors: {
						type: "array",
						items: {
							type: "object",
							properties: {
								field: { type: "string" },
								message: { type: "string" },
							},
						},
					},
				},
			},
		},
	},
};

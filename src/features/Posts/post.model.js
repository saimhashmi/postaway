import { UnauthorizedError } from "../../utils/errors.js";

let id = 0;
let posts = [];

export default class PostModel {
	constructor(userId, caption, imageUrl) {
		this.id = ++id;
		this.userId = userId;
		this.caption = caption;
		this.imageUrl = imageUrl;
	}
}

export const getPosts = (id = null) => {
	if (id) {
		return posts.find((post) => post.id == id);
	}
	return posts;
};

export const getPostsByuserId = (userId) => {
	return posts.filter((post) => post.userId == userId);
};

export const createPosts = (userId, caption, imageUrl) => {
	const newPost = new PostModel(userId, caption, imageUrl);
	posts.push(newPost);
	return newPost;
};

export const deletePost = (postId, userId) => {
	const index = posts.findIndex((post) => post.id == postId);
	if (index > -1) {
		if (posts[index].userId !== userId) {
			throw new UnauthorizedError(
				"User cannot delete another user's posts",
			);
		}
		const [removed] = posts.splice(index, 1);
		return removed;
	} else {
		return false;
	}
};

export const updatePost = (newData) => {
	const { caption, imageUrl } = newData;
	const index = posts.findIndex((post) => post.id == newData.id);
	if (index > -1) {
		if (posts[index].userId !== newData.userId) {
			throw new UnauthorizedError(
				"User cannot modify another user's posts",
			);
		}
		posts[index].caption = caption ? caption : posts[index].caption;
		posts[index].imageUrl = imageUrl ? imageUrl : posts[index].imageUrl;

		return posts[index];
	} else {
		return false;
	}
};

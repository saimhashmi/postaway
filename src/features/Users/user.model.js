let id = 0;
const users = [];

class UserSchema {
	constructor(name, email, password) {
		this.id = ++id;
		this.name = name;
		this.email = email;
		this.password = password;
	}
}

export const userRegister = (data) => {
	const newUser = new UserSchema(data.name, data.email, data.password);
	users.push(newUser);
	return newUser;
};

export const findUserByEmail = (email) => {
	return users.find((user) => user.email === email);
};

export const getAllUsers = () => {
	return users;
};

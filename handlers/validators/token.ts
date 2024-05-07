const TOKEN_KEY =
	"1a867a2fd5872174bcd0e00c69e516cf1a3c58990b99a8e00e369689faa9481a2c5c789b3199f665d47e6dec7c264564251483774a1bbfb8ce331a6f154214b7";

const token = {
	getToken: () => {
		return localStorage.getItem(TOKEN_KEY);
	},
	setToken: (token: string) => {
		return localStorage.setItem(TOKEN_KEY, token);
	},
	removeToken: () => {
		return localStorage.removeItem(TOKEN_KEY);
	},
};

export default token;

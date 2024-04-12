import { DataTypes } from "sequelize";

import database from "@/databases";

import { typeUserInstance } from "@/types/models";

const User = database.mern.define<typeUserInstance>("users", {
	fname: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	lname: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	phone: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	verified: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
	},
});

async () => {
	try {
		await User.sync();
		console.log(`+-> Created \'users\' table`);
	} catch (error: any) {
		console.error(`x-> Could not create \'users\' table:`, error.message);
	}
};

export default User;

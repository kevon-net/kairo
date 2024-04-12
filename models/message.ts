import { DataTypes } from "sequelize";

import database from "@/databases";

import { typeMessageInstance } from "@/types/models";

const Message = database.mern.define<typeMessageInstance>("messages", {
	fname: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	lname: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	phone: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	subject: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	message: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

async () => {
	try {
		await Message.sync();
		console.log(`+-> Created \'messages\' table`);
	} catch (error: any) {
		console.error(`x-> Could not create \'messages\' table:`, error.message);
	}
};

export default Message;

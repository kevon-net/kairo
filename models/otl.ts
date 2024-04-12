import { DataTypes } from "sequelize";

import database from "@/databases";

import { typeOtlInstance } from "@/types/models";

const Otl = database.mern.define<typeOtlInstance>("otls", {
	email: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	otl: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	userId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	createdAt: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	expiredAt: {
		type: DataTypes.DATE,
		allowNull: false,
	},
});

async () => {
	try {
		await Otl.sync();
		console.log(`+-> Created \'otls\' table`);
	} catch (error: any) {
		console.error(`x-> Could not create \'otls\' table:`, error.message);
	}
};

export default Otl;

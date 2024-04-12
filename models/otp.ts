import { DataTypes } from "sequelize";

import database from "@/databases";

import { typeOtpInstance } from "@/types/models";

const Otp = database.mern.define<typeOtpInstance>("otps", {
	email: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	otp: {
		type: DataTypes.STRING,
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
		await Otp.sync();
		console.log(`+-> Created \'otps\' table`);
	} catch (error: any) {
		console.error(`x-> Could not create \'otps\' table:`, error.message);
	}
};

export default Otp;

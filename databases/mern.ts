import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({ path: "/.env.local" });

const mern = new Sequelize(
	process.env.DB as string,
	process.env.DB_USERNAME as string,
	process.env.DB_PASSWORD as string,
	{
		host: process.env.DB_HOST as string,
		dialect: "mysql",
		dialectModule: require("mysql2"),
		// logging: false,
	}
);

async () => {
	try {
		await mern.authenticate();
		console.log(`+-> Connected to 'Mern DB'`);

		await mern.sync({ alter: true });
		console.log(`+-> 'Mern DB' synchronized`);
	} catch (error: any) {
		console.error("x-> Connection to 'Mern DB' failed:", error.message);
	}
};

export default mern;

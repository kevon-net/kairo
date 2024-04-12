const database = async (db: any) => {
	try {
		await db.authenticate();
	} catch (error: any) {
		console.error("x-> Database authentication failure:", error.message);
	}
};

export default database;

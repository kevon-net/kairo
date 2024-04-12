const dbAuth = (db: any) =>
	db
		.authenticate()
		.then(() => {
			console.log(`+-> Connected to 'Main DB'`);
		})
		.catch((error: Error) => {
			console.error("x-> Connection to 'Main DB' failed:", error.message);
			throw error;
		});

export default dbAuth;

const request = {
	post: async (url: string, options: RequestInit) => {
		try {
			const response = await fetch(url, options);
			const result = await response.json();

			return result;
		} catch (error: any) {
			console.error("x-> Post request failed: A server error occured");
			throw new Error("Could not complete the request.");
		}
	},
};

export default request;

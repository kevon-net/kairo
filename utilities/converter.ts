const converter = {
	millSec(milliseconds: number): { minutes: string; seconds: string } | undefined {
		try {
			var minutes = Math.floor(milliseconds / 60000).toString();
			var seconds = ((milliseconds % 60000) / 1000).toFixed(0).toString();

			return { minutes, seconds };
		} catch (error: any) {
			console.error("x-> Time convertion failure:", error.message);
		}
	},
};

export default converter;

const millToMinSec = (milliseconds: number) => {
	try {
		var minutes = Math.floor(milliseconds / 60000);
		var seconds = ((milliseconds % 60000) / 1000).toFixed(0);

		return { minutes, seconds };
	} catch (error: any) {
		console.error("x-> Time convertion failure:", error.message);
	}
};

export default millToMinSec;

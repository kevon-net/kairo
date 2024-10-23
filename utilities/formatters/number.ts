export interface MinSec {
	minutes: string;
	seconds: string;
}

export const millToMinSec = (milliseconds: number): MinSec | undefined => {
	try {
		var minutes = Math.floor(milliseconds / 60000).toString();
		var seconds = ((milliseconds % 60000) / 1000).toFixed(0).toString();

		return { minutes, seconds };
	} catch (error) {
		console.error("x-> Time convertion failure:", error);
	}
};

export const prependZeros = (value: number, length: number): string => {
	/**
	 * Convert value to string
	 * Prepend zeros until the length of the string is = 'length'
	 */
	const paddedStr = String(value).padStart(length, "0");

	return paddedStr;
};

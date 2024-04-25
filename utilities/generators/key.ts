import { randomBytes } from "crypto";

const key = () => {
	try {
		const buf = randomBytes(64);
		console.log(`+-> Key generated: ${buf.length} bytes of random data: ${buf.toString("hex")}`);
		return buf.toString("hex");
	} catch (error: any) {
		console.error("x-> Key generation failure:", error.message);
	}
};

export default key;

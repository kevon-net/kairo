import { SALT_ROUNDS } from "@/data/constants";
import { HashingAlgorithm } from "@/types/enums";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

// create hashing function
export const hashValue = async (
	rawValue: string | number,
	algorithm: HashingAlgorithm = HashingAlgorithm.BCRYPT
): Promise<string | undefined> => {
	try {
		// handle different hashing algorithms
		switch (algorithm) {
			case HashingAlgorithm.BCRYPT:
				return await bcryptjs.hash(`${rawValue}`, SALT_ROUNDS);
			case HashingAlgorithm.SHA256:
				return crypto.createHash("sha256").update(rawValue.toString()).digest("hex");
			case HashingAlgorithm.SHA512:
				return crypto.createHash("sha512").update(rawValue.toString()).digest("hex");
			default:
				throw new Error("Unsupported hashing algorithm");
		}
	} catch (error) {
		console.error("---> utility error (hash value):", error);
		throw error;
	}
};

// create hash comparison function
export const compareHashes = async (
	rawValue: string | number,
	hashedValue: string | null,
	algorithm: HashingAlgorithm = HashingAlgorithm.BCRYPT
): Promise<boolean> => {
	try {
		if (!hashedValue) {
			return false;
		}

		// handle different hashing algorithms
		switch (algorithm) {
			case HashingAlgorithm.BCRYPT:
				return await bcryptjs.compare(rawValue.toString(), hashedValue);
			case HashingAlgorithm.SHA256:
			case HashingAlgorithm.SHA512:
				const hash = crypto.createHash(algorithm).update(rawValue.toString()).digest("hex");
				return hash === hashedValue;
			default:
				throw new Error("Unsupported hashing algorithm");
		}
	} catch (error) {
		console.error("---> utility error (compare values):", error);
		throw error;
	}
};

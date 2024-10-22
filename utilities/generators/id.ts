import { createId } from "@paralleldrive/cuid2";

export const generateCuid2 = () => {
	const uniqueId = createId();

	return uniqueId; // Returns something like: "cjld2cjxh0000qzrmn831i7rn"
};

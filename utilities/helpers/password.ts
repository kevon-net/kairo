export const getStrength = (password: string, requirements: { re: RegExp; label: string }[]) => {
	let multiplier = password.length >= 8 ? 0 : 1;

	requirements.forEach((requirement) => {
		if (!requirement.re.test(password)) {
			multiplier += 1;
		}
	});

	return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
};

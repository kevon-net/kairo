export const isFirstItem = <T>(array: T[], item: T): boolean => {
	return array[0] === item;
};

export const isLastItem = <T>(array: T[], item: T): boolean => {
	return array[array.length - 1] === item;
};

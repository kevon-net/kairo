import { SortOrder } from "@/types/enums";

export const isFirstItem = <T>(array: T[], item: T): boolean => {
	return array[0] === item;
};

export const isLastItem = <T>(array: T[], item: T): boolean => {
	return array[array.length - 1] === item;
};

export const sortArray = <T>(array: T[], property: keyof T, order: SortOrder): T[] => {
	return [...array].sort((a, b) => {
		const aValue = a[property];
		const bValue = b[property];

		if (aValue < bValue) return order === SortOrder.ASCENDING ? -1 : 1;
		if (aValue > bValue) return order === SortOrder.ASCENDING ? 1 : -1;

		return 0; // Values are equal
	});
};

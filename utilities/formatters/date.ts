import { FormatOptions } from "@/types/date";

export const getRegionalDate = (date: Date, options: FormatOptions = {}) => {
	// Handle both string and Date inputs
	const dateObj = typeof date === "string" ? new Date(date) : date;

	// Check if the date is valid
	if (isNaN(dateObj.getTime())) {
		throw new Error("---> utility error - (invalid date)");
	}

	const {
		locale = Intl.DateTimeFormat().resolvedOptions().locale,
		timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
		dateStyle,
		timeStyle,
		monthFormat = "numeric",
		yearFormat = "numeric"
	} = options;

	return new Intl.DateTimeFormat(locale, {
		timeZone: timezone,
		dateStyle,
		timeStyle,
		month: monthFormat,
		year: yearFormat,
		day: "numeric"
	}).format(dateObj);

	// Output: 10/22/2024 | 22/10/2024 | 22.10.2024 | ... (depending on locale)
};

export const isFutureDate = (date: Date): boolean => {
	return date.getTime() > new Date().getTime();
};

export const isPastDate = (date: Date): boolean => {
	return date.getTime() < new Date().getTime();
};

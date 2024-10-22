// Define supported regions and their formats
export type DateRegion = "US" | "UK" | "EU" | "JP" | "CN" | "AUTO";

export interface FormatOptions {
	locale?: string; // en-US | en-GB
	timezone?: string;
	dateStyle?: "full" | "long" | "medium" | "short";
	timeStyle?: "full" | "long" | "medium" | "short";
	monthFormat?: "numeric" | "2-digit" | "long" | "short" | "narrow";
	yearFormat?: "numeric" | "2-digit";
}

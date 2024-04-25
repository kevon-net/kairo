import { Icon } from "@tabler/icons-react";

export interface typeLink {
	link: string;
	label: string;
}

export interface typeNav {
	link: string;
	label: string;
	iconLeft?: Icon;
	iconRight?: Icon;
	subLinks?: typeLink[];
}

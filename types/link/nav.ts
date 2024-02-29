import { Icon } from "@tabler/icons-react";

export interface typeNav {
	link: string;
	label: string;
	iconLeft?: Icon;
	iconRight?: Icon;
	subLinks?: { link: string; label: string }[];
}

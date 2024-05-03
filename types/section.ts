import React from "react";

type typeSection = {
	containerized?: boolean | string;
	padded?: boolean | number | "xs" | "sm" | "md" | "lg" | "xl";
	margined?: boolean | number | "xs" | "sm" | "md" | "lg" | "xl";
	className?: string;
	bordered?: boolean;
	shadowed?: boolean;
	children: React.ReactNode;
};

export default typeSection;

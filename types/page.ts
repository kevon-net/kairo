import React from "react";

type typePage = {
	padded?: boolean | number | "xs" | "sm" | "md" | "lg" | "xl";
	stacked?: boolean | number | "xs" | "sm" | "md" | "lg" | "xl";
	children: React.ReactNode;
};

export default typePage;

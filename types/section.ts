import React from "react";

type typeSection = {
	containerized?: boolean | string;
	padded?: boolean | string | number;
	margined?: boolean | number;
	className?: string;
	bordered?: boolean;
	shadowed?: boolean;
	children: React.ReactNode;
};

export default typeSection;

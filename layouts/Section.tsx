import React from "react";

import { Box } from "@mantine/core";

import typeSection from "@/types/section";

import classes from "./Section.module.scss";
import Component from "@/components";

export default function Section({
	containerized,
	padded,
	margined,
	bordered,
	shadowed,
	children,
	className,
	...restProps
}: typeSection) {
	return (
		<Box
			component={"section"}
			py={padded ? (typeof padded == "boolean" ? 96 : padded) : undefined}
			my={margined ? (typeof margined == "boolean" ? 96 : margined) : undefined}
			{...restProps}
			className={`${className} ${bordered && classes.border} ${shadowed && classes.shadow}`}
		>
			{containerized ? (
				<Component.Core.Container.Responsive
					size={typeof containerized == "boolean" ? undefined : containerized}
				>
					{children}
				</Component.Core.Container.Responsive>
			) : (
				children
			)}
		</Box>
	);
}

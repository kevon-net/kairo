import React from "react";

import { Box, Container } from "@mantine/core";

import typeSection from "@/types/section";

import classes from "./section.module.scss";
import Component from "@/components";

export default function Section({
	containerized,
	padded,
	margined,
	bordered,
	shadowed,
	children,
	...restProps
}: typeSection) {
	return (
		<Box
			component={"section"}
			py={padded ? (typeof padded == "boolean" ? 96 : padded) : undefined}
			my={margined ? (typeof margined == "boolean" ? 96 : margined) : undefined}
			{...restProps}
			className={`${bordered && classes.border} ${shadowed && classes.shadow}`}
		>
			{containerized ? (
				<Component.Container.Responsive size={typeof containerized == "boolean" ? undefined : containerized}>
					{children}
				</Component.Container.Responsive>
			) : (
				{ children }
			)}
		</Box>
	);
}

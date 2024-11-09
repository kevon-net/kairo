import React from "react";

import { Box, Stack } from "@mantine/core";

import { Page as typePage } from "@/types/layout";
import { sectionSpacing } from "@/data/constants";

export default function Page({
	children,
	padded,
	stacked,
	...restProps
}: typePage & React.ComponentProps<typeof Box & typeof Stack>) {
	return (
		<Box
			component={stacked ? Stack : "article"}
			w={"100%"}
			gap={stacked ? (typeof stacked == "boolean" ? sectionSpacing : stacked) : undefined}
			py={padded ? (typeof padded == "boolean" ? sectionSpacing : padded) : undefined}
			{...restProps}
		>
			{children}
		</Box>
	);
}

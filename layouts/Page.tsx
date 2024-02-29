import React from "react";

import { Box, Stack } from "@mantine/core";

import typePage from "@/types/page";

export default function Page({ padded, stacked, children, ...restProps }: typePage) {
	return (
		<Box
			component={stacked ? Stack : "article"}
			gap={stacked ? (typeof stacked == "boolean" ? 96 : stacked) : undefined}
			py={padded ? (typeof padded == "boolean" ? 96 : padded) : undefined}
			{...restProps}
		>
			{children}
		</Box>
	);
}

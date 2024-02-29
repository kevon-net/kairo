import React from "react";

import { Box, Container } from "@mantine/core";

type typeSection = {
	containerized?: boolean;
	containerSize?: "xs" | "sm" | "md" | "lg" | "xl";
	padded?: boolean | number;
	margined?: boolean | number;
	bordered?: boolean;
	shadowed?: boolean;
	children: React.ReactNode;
} & React.ComponentProps<typeof Box & typeof Container>;

export default typeSection;

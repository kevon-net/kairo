import React from "react";

import { Box, Container } from "@mantine/core";

type typeSection = {
	containerized?: boolean | string;
	padded?: boolean | string | number;
	margined?: boolean | number;
	bordered?: boolean;
	shadowed?: boolean;
	children: React.ReactNode;
} & React.ComponentProps<typeof Box & typeof Container>;

export default typeSection;

import React from "react";

import { Box, Stack } from "@mantine/core";

type typePage = {
	padded?: boolean | number;
	stacked?: boolean | number;
	children: React.ReactNode;
} & React.ComponentProps<typeof Box & typeof Stack>;

export default typePage;

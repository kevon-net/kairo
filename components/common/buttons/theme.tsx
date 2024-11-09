"use client";

import React from "react";

import { useMantineColorScheme, useComputedColorScheme, ActionIcon } from "@mantine/core";

import { IconMoon, IconSun } from "@tabler/icons-react";
import { iconStrokeWidth } from "@/data/constants";

export default function Theme({ props }: { props?: { size?: number } }) {
	const { colorScheme, setColorScheme } = useMantineColorScheme({
		keepTransitions: true,
	});
	const computedColorScheme = useComputedColorScheme("light", {
		getInitialValueInEffect: true,
	});

	return (
		<ActionIcon
			onClick={() => setColorScheme(computedColorScheme === "light" ? "dark" : "light")}
			aria-label="Toggle color scheme"
			size={props?.size || 30}
			variant="light"
		>
			{colorScheme == "dark" && <IconSun size={16} stroke={iconStrokeWidth} />}
			{colorScheme == "light" && <IconMoon size={16} stroke={iconStrokeWidth} />}
		</ActionIcon>
	);
}

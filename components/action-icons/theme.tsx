"use client";

import React from "react";

import { useMantineColorScheme, useComputedColorScheme, ActionIcon } from "@mantine/core";

import { IconMoon, IconSun } from "@tabler/icons-react";

export default function Theme() {
	const { colorScheme, setColorScheme } = useMantineColorScheme({ keepTransitions: true });
	const computedColorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true });

	return (
		<ActionIcon
			onClick={() => setColorScheme(computedColorScheme === "light" ? "dark" : "light")}
			aria-label="Toggle color scheme"
			size={30}
			// color="var(--mantine-color-pri-0)"
			// c={"var(--mantine-color-pri-9)"}
			variant="light"
		>
			{colorScheme == "dark" && <IconSun size={16} stroke={1.5} />}
			{colorScheme == "light" && <IconMoon size={16} stroke={1.5} />}
		</ActionIcon>
	);
}

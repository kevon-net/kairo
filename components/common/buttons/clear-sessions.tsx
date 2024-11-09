"use client";

import React from "react";

import { Button, ButtonProps, Tooltip } from "@mantine/core";

export default function ClearSessions({ children, ...restProps }: { children: React.ReactNode } & ButtonProps) {
	return (
		<Tooltip
			label={"Log out of all other active sessions on other devices besides this one."}
			withArrow
			position="top-end"
			multiline
			w={240}
			arrowOffset={60}
		>
			<Button size="xs" {...restProps} onClick={async () => {}}>
				{children}
			</Button>
		</Tooltip>
	);
}

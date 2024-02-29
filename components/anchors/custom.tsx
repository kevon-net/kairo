import React from "react";

import { Anchor } from "@mantine/core";

import classes from "./custom.module.scss";

export default function Navbar({
	href,
	children,
	...restProps
}: { href: string; nextlink?: boolean; children: React.ReactNode } & React.ComponentProps<typeof Anchor>) {
	return (
		<Anchor href={href} className={classes.link} {...restProps}>
			{children}
		</Anchor>
	);
}

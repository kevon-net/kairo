import React from "react";

import Link from "next/link";

import { NavLink } from "@mantine/core";

import classes from "./Navbar.module.scss";

export default function Navbar({
	children,
	withChildren,
	href,
	label,
	...restProps
}: {
	children?: React.ReactNode;
	withChildren?: boolean;
	href: string;
	label: string;
} & React.ComponentProps<typeof NavLink>) {
	return withChildren ? (
		<NavLink
			component={Link}
			href={href}
			label={label}
			{...restProps}
			classNames={{
				body: classes.body,
				chevron: classes.chevron,
				children: classes.children,
				collapse: classes.collapse,
				description: classes.description,
				label: classes.label,
				root: classes.root,
				section: classes.section,
			}}
		>
			{children}
		</NavLink>
	) : (
		<NavLink
			component={Link}
			href={href}
			label={label}
			{...restProps}
			classNames={{
				body: classes.body,
				chevron: classes.chevron,
				children: classes.children,
				collapse: classes.collapse,
				description: classes.description,
				label: classes.label,
				root: classes.root,
				section: classes.section,
			}}
		/>
	);
}

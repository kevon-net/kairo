import React from "react";

import Link from "next/link";

import { NavLink } from "@mantine/core";

import classes from "./Navbar.module.scss";

export default function Navbar({
	children,
	withChildren,
	href,
	label,
	active,
	opened,
	...restProps
}: {
	children?: React.ReactNode;
	withChildren?: boolean;
	href: string;
	label: string;
	active?: boolean;
	opened?: boolean;
} & React.ComponentProps<typeof NavLink>) {
	return withChildren ? (
		<NavLink
			component={Link}
			href={href}
			label={label}
			active={active}
			opened={opened}
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
			active={active}
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

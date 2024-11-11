"use client";

import React from "react";

import Link from "next/link";

import { Grid, GridCol, NavLink } from "@mantine/core";

import classes from "./account.module.scss";
import { navLinkItems } from "../asides/account";
import { usePathname } from "next/navigation";

export default function Account() {
	const pathname = usePathname();

	return (
		<Grid gutter={"xs"}>
			{navLinkItems.account.map((item) => (
				<GridCol key={item.label} span={{ base: 6, xs: 4, sm: 4 }}>
					<NavLink
						classNames={{ root: classes.root }}
						component={Link}
						href={item.link}
						label={item.label}
						leftSection={<item.icon size={16} />}
						active={item.link == pathname}
					/>
				</GridCol>
			))}
		</Grid>
	);
}

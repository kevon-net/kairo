import React from "react";

import Link from "next/link";

import { Box, Breadcrumbs } from "@mantine/core";

import { IconChevronRight } from "@tabler/icons-react";

import classes from "./hero.module.scss";

export default function Hero({ data }: { data: { label: string; link: string }[] }) {
	return (
		<Breadcrumbs separator={<IconChevronRight size={12} stroke={2} />}>
			{data.map(crumb => (
				<Box
					component={Link}
					href={crumb.link}
					key={crumb.link}
					className={classes.link}
					c={data.indexOf(crumb) == data.length - 1 ? "pri.8" : ""}
				>
					{crumb.label}
				</Box>
			))}
		</Breadcrumbs>
	);
}

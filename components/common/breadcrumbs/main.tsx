import React from "react";

import Link from "next/link";

import { Anchor, Breadcrumbs } from "@mantine/core";

import { IconChevronRight } from "@tabler/icons-react";

import classes from "./main.module.scss";

import { Link as typeLink } from "@/types/link";
import { iconStrokeWidth } from "@/data/constants";

export default function Main({ props }: { props: typeLink[] }) {
	const active = (breadcrumb: typeLink) =>
		props.indexOf(breadcrumb) == props.length - 1;

	return (
		<Breadcrumbs
			separator={<IconChevronRight size={12} stroke={iconStrokeWidth} />}
		>
			{props.map((item) => (
				<Anchor
					key={item.link}
					component={Link}
					href={item.link}
					c={active(item) ? "pri" : undefined}
					className={classes.link}
				>
					{item.label}
				</Anchor>
			))}
		</Breadcrumbs>
	);
}

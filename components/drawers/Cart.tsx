"use client";

import React from "react";

import { ActionIcon, Center, Drawer, Indicator, Stack, Text } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconShoppingCart } from "@tabler/icons-react";

import classes from "./Cart.module.scss";

export default function Cart({ items }: { items?: any }) {
	const [opened, { open, close }] = useDisclosure(false);
	const mobile = useMediaQuery("(max-width: 36em)");
	const tablet = useMediaQuery("(max-width: 48em)");

	return (
		<>
			<Drawer
				opened={opened}
				onClose={close}
				size={mobile ? 240 : tablet ? 320 : 320}
				title={
					<Text component="span" inherit fw={500}>
						Cart
					</Text>
				}
				position="right"
				classNames={{
					body: classes.body,
					header: classes.header,
					inner: classes.inner,
					overlay: classes.overlay,
					root: classes.root,
					title: classes.title,
				}}
			>
				{!items ? (
					<Stack align="center">
						<Text ta={"center"} mt={"xl"} className="textResponsive">
							Your cart is empty.
						</Text>
					</Stack>
				) : (
					`items`
				)}
			</Drawer>

			<Indicator
				disabled={!items}
				processing={false}
				size={tablet ? 12 : 14}
				offset={2}
				onClick={open}
				label={
					items ? (
						<Text component="span" inherit fw={500} fz={10}>
							{items.length}
						</Text>
					) : undefined
				}
				className={classes.indicator}
			>
				<Center>
					<ActionIcon onClick={open} variant="transparent">
						<Center>
							<IconShoppingCart size={tablet ? 20 : 24} />
						</Center>
					</ActionIcon>
				</Center>
			</Indicator>
		</>
	);
}

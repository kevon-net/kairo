import React from "react";

import { Box, Container, Flex } from "@mantine/core";

import Provider from "@/providers";

import typeBody from "@/types/body";

export default function Body({ header, nav, hero, children, aside, footer }: typeBody) {
	const handleAside = (side: React.ReactNode, width: string) => (
		<Box
			component="aside"
			visibleFrom="md"
			style={{
				width: width,
				position: "sticky",
				top: 48,
				maxHeight: "100%",
			}}
		>
			{side}
		</Box>
	);

	return (
		<>
			{header && header}
			{nav && nav}
			{hero && hero}
			{aside ? (
				<Container component={"article"}>
					<Flex gap={"xl"}>
						{aside.left && handleAside(aside.left, "25%")}
						<Box w={"75%"}>{children}</Box>
						{aside.right && handleAside(aside.right, "25%")}
					</Flex>
				</Container>
			) : (
				children
			)}
			{footer && footer}
		</>
	);
}

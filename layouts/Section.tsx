import React from "react";

import { Box, Container } from "@mantine/core";

import { ClerkProvider } from "@clerk/nextjs";

import { typeSection } from "@/types/layout";

import classes from "./Section.module.scss";

export default function Section({
	containerized,
	padded,
	margined,
	className,
	bordered,
	shadowed,
	withClerk,
	children,
	...restProps
}: typeSection & React.ComponentProps<typeof Box & typeof Container>) {
	const handleClerk = (provider?: boolean) => {
		return !provider ? <React.Fragment>{children}</React.Fragment> : <ClerkProvider>{children}</ClerkProvider>;
	};

	return (
		<Box
			component={"section"}
			py={padded ? (typeof padded == "boolean" ? 48 : padded) : undefined}
			my={margined ? (typeof margined == "boolean" ? 48 : margined) : undefined}
			className={`${className} ${bordered && classes.border} ${shadowed && classes.shadow}`}
			{...restProps}
		>
			{containerized ? (
				<Container size={typeof containerized == "boolean" ? undefined : containerized}>
					{handleClerk(withClerk)}
				</Container>
			) : (
				handleClerk(withClerk)
			)}
		</Box>
	);
}

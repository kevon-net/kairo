import React from "react";

import { Center } from "@mantine/core";

import LayoutBody from "@/layouts/Body";

import { ClerkProvider } from "@clerk/nextjs";

export default function Authentication({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<LayoutBody>
			<Center component="main" mih={"100vh"}>
				<ClerkProvider>{children}</ClerkProvider>
			</Center>
		</LayoutBody>
	);
}

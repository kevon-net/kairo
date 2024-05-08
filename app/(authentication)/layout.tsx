import React from "react";

import { Center } from "@mantine/core";

import Layout from "@/layouts";

import { ClerkProvider } from "@clerk/nextjs";

export default function Authentication({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<Layout.Body>
			<Center component="main" mih={"100vh"}>
				<ClerkProvider>{children}</ClerkProvider>
			</Center>
		</Layout.Body>
	);
}

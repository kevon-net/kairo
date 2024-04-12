import React from "react";

import Layout from "@/layouts";

import { Center } from "@mantine/core";

export default function Authentication({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<Layout.Body>
			<Center component="main" mih={"100vh"}>
				{children}
			</Center>
		</Layout.Body>
	);
}

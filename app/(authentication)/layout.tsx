import React from "react";

import { Center } from "@mantine/core";

import LayoutBody from "@/layouts/Body";

export default function Authentication({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<LayoutBody>
			<main>
				{/* <Center component="main" mih={"100vh"}> */}
				{children}
				{/* </Center> */}
			</main>
		</LayoutBody>
	);
}

import React from "react";

import { Center } from "@mantine/core";

import Layout from "@/layouts";
import Partial from "@/partials";

import { auth } from "@/auth";

export const generateMetadata = async (): Metadata => {
	const session = await auth();

	return {
		title: {
			default: "Authentication",
			template: `%s - ${session?.user ? session.user.name : "User"} - Next Template`,
		},
	};
};

export default function Authentication({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<Layout.Body
		// nav={<Partial.Navbar.Main />}
		// footer={<Partial.Footer.Main />}
		>
			<main>
				<Center component="main" mih={"100vh"}>
					{children}
				</Center>
			</main>
		</Layout.Body>
	);
}

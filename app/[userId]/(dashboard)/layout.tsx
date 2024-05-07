import React from "react";

import Layout from "@/layouts";
import Partial from "@/partials";

import { auth } from "@/auth";

export const generateMetadata = async (): Metadata => {
	const session = await auth();

	return {
		title: {
			default: "Dashboard",
			template: `%s - Dashboard - ${session?.user ? session.user.name : "User"} - Next Template`,
		},
	};
};

export default function Marketing({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<Layout.Body
		// nav={<Partial.Navbar.Main />}
		// footer={<Partial.Footer.Main />}
		>
			<main>{children}</main>
		</Layout.Body>
	);
}

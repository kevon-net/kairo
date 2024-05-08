import React from "react";

import Layout from "@/layouts";
import Partial from "@/partials";

import { currentUser } from "@clerk/nextjs/server";

export const generateMetadata = async (): Metadata => {
	const user = await currentUser();

	return {
		title: {
			default: "Dashboard",
			template: `%s - Dashboard - ${user ? user.fullName : "User"} - Next Template`,
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

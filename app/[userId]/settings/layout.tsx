import React from "react";

import { Metadata } from "next";

import Layout from "@/layouts";
import Partial from "@/partials";

import { auth } from "@/auth";

export const generateMetadata = async (): Metadata => {
	const session = await auth();

	return {
		title: {
			default: "Settings",
			template: `%s - Settings - ${session?.user ? session.user.name : "User"} - Next Template`,
		},
	};
};

export default function Profile({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<Layout.Body
			nav={<Partial.Navbar.Main />}
			footer={<Partial.Footer.Main />}
			aside={{ left: <Partial.Aside.User /> }}
		>
			<Layout.Section component={"main"} padded>
				<Layout.Section containerized={"responsive"} hiddenFrom="md" mb={"xl"}>
					Profile nav (mobile)
				</Layout.Section>
				{children}
			</Layout.Section>
		</Layout.Body>
	);
}

import React from "react";

import Layout from "@/layouts";
import Partial from "@/partials";

export default function Profile({
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

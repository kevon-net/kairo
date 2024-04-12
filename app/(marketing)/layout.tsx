import React from "react";

import Layout from "@/layouts";
import Partial from "@/partials";

export default function Marketing({
	children, // will be a page or nested layout
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<Layout.Body nav={<Partial.Navbar.Main />} footer={<Partial.Footer.Main />}>
			<main>{children}</main>
		</Layout.Body>
	);
}

import React from "react";

import Layout from "@/layouts";

export default function Blog({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return <Layout.Body>{children}</Layout.Body>;
}

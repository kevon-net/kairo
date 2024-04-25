import React from "react";

import Layout from "@/layouts";

export interface typeParams {
	params: { blogId: string };
}

export default function BlogDetails({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return <Layout.Body>{children}</Layout.Body>;
}

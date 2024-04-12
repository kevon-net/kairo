import React from "react";

import Layout from "@/layouts";

import { typeParams } from "./layout";

export default function BlogDetails({ params }: typeParams) {
	return (
		<Layout.Page>
			<Layout.Section containerized>Blog {params.blogId}</Layout.Section>
		</Layout.Page>
	);
}

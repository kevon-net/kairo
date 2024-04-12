import React from "react";

import { Metadata } from "next";

import Layout from "@/layouts";

export interface typeParams {
	params: { blogId: string };
}

export const generateMetadata = ({ params }: typeParams): Metadata => {
	return { title: `Blog ${params.blogId}` };
};

export default function BlogDetails({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return <Layout.Body>{children}</Layout.Body>;
}

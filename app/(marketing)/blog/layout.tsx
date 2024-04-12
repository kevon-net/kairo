import React from "react";

import { Metadata } from "next";

import Layout from "@/layouts";

export const metadata: Metadata = {
	title: { default: "Blog", template: "%s | Next Template - Blog" },
};

export default function Blog({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return <Layout.Body>{children}</Layout.Body>;
}

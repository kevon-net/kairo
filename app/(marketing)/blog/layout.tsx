import React from "react";

import { Metadata } from "next";

import LayoutBody from "@/layouts/Body";

export const metadata: Metadata = {
	title: { default: "Blog", template: "%s - Blog - Next Template" },
};

export default function Blog({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return <LayoutBody>{children}</LayoutBody>;
}

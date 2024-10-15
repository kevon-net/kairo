import React from "react";

import { Metadata } from "next";

import LayoutBody from "@/components/layouts/body";

import appData from "@/data/app";

export interface typeParams {
	blogId: string;
}

export const metadata: Metadata = {
	title: { default: "Blog", template: `%s - Blog - ${appData.name.app}` },
};

export default function Blog({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return <LayoutBody>{children}</LayoutBody>;
}

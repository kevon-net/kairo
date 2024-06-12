import React from "react";

import { Metadata } from "next";

import LayoutBody from "@/layouts/Body";

export interface typeParams {
	params: { blogId: string };
}

export const generateMetadata = ({ params }: typeParams): Metadata => {
	return { title: params.blogId };
};

export default function Post({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return <LayoutBody aside={{ right: { component: <div>aside blog</div> } }}>{children}</LayoutBody>;
}

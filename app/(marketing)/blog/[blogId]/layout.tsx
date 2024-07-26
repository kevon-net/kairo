import React from "react";

import { Metadata } from "next";

import LayoutBody from "@/layouts/Body";
import AsideBlog from "@/partials/asides/Blog";

import link from "@/handlers/parsers/string/link";

import posts from "@/data/blog";

export interface typeParams {
	params: { blogId: string };
}

export const generateMetadata = ({ params }: typeParams): Metadata => {
	return { title: posts.find(p => link.linkify(p.titleLink) == params.blogId)?.title };
};

export default function Post({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return <LayoutBody aside={{ right: { component: <AsideBlog /> } }}>{children}</LayoutBody>;
}

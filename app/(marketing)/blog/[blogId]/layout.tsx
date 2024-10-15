import React from "react";

import { Metadata } from "next";

import LayoutBody from "@/components/layouts/body";
import AsideBlog from "@/components/partials/asides/blog";

import sample from "@/data/sample";

import { typeParams } from "../layout";
import { linkify } from "@/handlers/parsers/string";

export const generateMetadata = ({ params }: { params: typeParams }): Metadata => {
	return { title: sample.blogPosts.find(p => linkify(p.titleLink) == params.blogId)?.title };
};

export default function Post({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return <LayoutBody aside={{ right: { component: <AsideBlog /> } }}>{children}</LayoutBody>;
}

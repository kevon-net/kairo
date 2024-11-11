import React from "react";

import { Metadata } from "next";

import LayoutBody from "@/components/layout/body";
import AsideBlog from "@/components/layout/asides/blog";

import { typeParams } from "../layout";
import { linkify } from "@/utilities/formatters/string";
import { PostRelations } from "@/types/models/post";
import { postsGet } from "@/handlers/requests/database/post";

export const generateMetadata = async ({ params }: { params: typeParams }): Promise<Metadata> => {
	const posts: PostRelations[] = await postsGet();

	return {
		title: posts.find((p) => linkify(p.title) == params.blogId)?.title,
	};
};

export default function Post({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return <LayoutBody aside={{ right: { component: <AsideBlog /> } }}>{children}</LayoutBody>;
}

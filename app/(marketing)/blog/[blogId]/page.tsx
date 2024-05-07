import React from "react";

import { Metadata } from "next";

import Layout from "@/layouts";

import { typeParams } from "./layout";

export const generateMetadata = ({ params }: typeParams): Metadata => {
	return { title: params.blogId };
};

export default function BlogDetails({ params }: typeParams) {
	return (
		<Layout.Page padded>
			<Layout.Section containerized={"responsive"}>Blog {params.blogId}</Layout.Section>
		</Layout.Page>
	);
}

import React from "react";

import { Metadata } from "next";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";

import { typeParams } from "./layout";

export const generateMetadata = ({ params }: typeParams): Metadata => {
	return { title: params.blogId };
};

export default function BlogDetails({ params }: typeParams) {
	return (
		<LayoutPage padded>
			<LayoutSection containerized={"responsive"}>Blog {params.blogId}</LayoutSection>
		</LayoutPage>
	);
}

import React from "react";

import LayoutPage from "@/components/layouts/page";
import LayoutSection from "@/components/layouts/section";

import { typeParams } from "../layout";

export default function Post({ params }: { params: typeParams }) {
	return (
		<LayoutPage>
			<LayoutSection id={"page-post"} padded>
				Blog {params.blogId}
			</LayoutSection>
		</LayoutPage>
	);
}

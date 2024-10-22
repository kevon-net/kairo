import React from "react";

import LayoutPage from "@/components/layout/page";
import LayoutSection from "@/components/layout/section";

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

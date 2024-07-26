import React from "react";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";

export default async function Payment() {
	return (
		<LayoutPage>
			<LayoutSection padded containerized={"responsive"}>
				Payment details page
			</LayoutSection>
		</LayoutPage>
	);
}

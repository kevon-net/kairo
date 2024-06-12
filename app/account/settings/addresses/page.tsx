import React from "react";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";

export default async function Addresses() {
	return (
		<LayoutPage>
			<LayoutSection padded containerized={"responsive"}>
				Shipping addresses page
			</LayoutSection>
		</LayoutPage>
	);
}

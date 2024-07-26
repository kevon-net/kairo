import React from "react";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";

export default async function Notifications() {
	return (
		<LayoutPage>
			<LayoutSection padded containerized={"responsive"}>
				Notifications page
			</LayoutSection>
		</LayoutPage>
	);
}

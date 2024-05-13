import React from "react";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";

export default function Home() {
	return (
		<LayoutPage padded>
			<LayoutSection containerized={"responsive"}>Home page</LayoutSection>
		</LayoutPage>
	);
}

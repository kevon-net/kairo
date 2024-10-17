import React from "react";

import LayoutSection from "../section";

import PartialHeroRoute from "@/components/partials/heros/route";

export default function Main() {
	return (
		<LayoutSection id={"layout-hero-main"}>
			<PartialHeroRoute />
		</LayoutSection>
	);
}

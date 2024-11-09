"use client";

import React, { useState } from "react";

import {
	Transition as TransitionComponent,
	TransitionProps
} from "@mantine/core";

export default function Transition({
	mounted = false,
	transition = "fade",
	children,
	...restProps // Gather remaining props
}: {
	mounted: boolean;
	transition?: TransitionProps["transition"];
	children: React.ReactNode;
} & Omit<TransitionProps, "mounted" | "transition" | "children">) {
	return (
		<TransitionComponent
			mounted={mounted}
			transition={transition}
			duration={250}
			timingFunction="ease"
			{...restProps} // Spread the restProps here
		>
			{(styles) => (
				<div
					style={{
						...styles,
						overflow: "hidden", // Ensure content is hidden during height transition
						transition: "max-height 250ms ease", // Animate max-height property
						maxHeight: mounted ? 200 : 0 // Set your content height when mounted, or 0 when unmounting
					}}
				>
					{children}
				</div>
			)}
		</TransitionComponent>
	);
}

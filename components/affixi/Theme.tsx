"use client";

import React from "react";

import { Affix, Transition } from "@mantine/core";

import SwitchTheme from "../switches/Theme";

export default function Theme() {
	return (
		<Affix position={{ bottom: "var(--mantine-spacing-xl)", left: "var(--mantine-spacing-xl)" }}>
			<Transition transition="slide-right" mounted={true}>
				{transitionStyles => (
					<div style={transitionStyles}>
						<SwitchTheme />
					</div>
				)}
			</Transition>
		</Affix>
	);
}

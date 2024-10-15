"use client";

import React from "react";

import { Affix, Center, Transition } from "@mantine/core";

import SwitchTheme from "../switches/theme";

import classes from "./theme.module.scss";

export default function Theme() {
	return (
		<Affix position={{ bottom: "var(--mantine-spacing-xl)", left: 0 }}>
			<Transition transition="slide-right" mounted={true}>
				{transitionStyles => (
					<div style={transitionStyles} className={classes.box}>
						<Center p={"sm"}>
							<SwitchTheme />
						</Center>
					</div>
				)}
			</Transition>
		</Affix>
	);
}

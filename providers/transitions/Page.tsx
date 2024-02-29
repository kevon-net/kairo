"use client";

import React, { useState } from "react";

import { Transition } from "@mantine/core";

export default function Page({ children }: { children: React.ReactNode }) {
	const [mounted, setMounted] = useState(false);

	setTimeout(() => setMounted(true), 500);

	return (
		<Transition mounted={mounted} transition="fade" duration={250} timingFunction="ease">
			{styles => <div style={styles}>{children}</div>}
		</Transition>
	);
}

import React from "react";

import { MantineTransition, Transition } from "@mantine/core";
import { useInViewport } from "@mantine/hooks";

export default function Component({
	transition,
	children,
}: {
	transition?: MantineTransition | undefined;
	children: React.ReactNode;
}) {
	const { ref, inViewport } = useInViewport();

	return (
		<div ref={ref}>
			<Transition
				mounted={inViewport}
				transition={transition ? transition : "slide-up"}
				duration={250}
				timingFunction="ease"
			>
				{(styles) => <div style={styles}>{children}</div>}
			</Transition>
		</div>
	);
}

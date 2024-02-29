"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ScrollTop({ children }: { children: React.ReactNode }) {
	const location = usePathname();
	const [previousLocation, setPreviousLocation] = useState("");

	useEffect(() => {
		if (previousLocation !== location) {
			window.scrollTo({ top: 0, behavior: "smooth" });
			setPreviousLocation(location);
		}
	}, [location, previousLocation]);

	return <>{children}</>;
}

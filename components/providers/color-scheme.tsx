"use client";

import React, { useState } from "react";
import { ColorSchemeContext } from "@/contexts/color-scheme";

export default function ColorScheme({ scheme, children }: { scheme: string; children: React.ReactNode }) {
	const [colorScheme, setColorScheme] = useState<string>(scheme);

	return (
		<ColorSchemeContext.Provider value={{ colorScheme, setColorScheme }}>{children}</ColorSchemeContext.Provider>
	);
}

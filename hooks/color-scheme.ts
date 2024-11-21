import { ColorSchemeContext } from "@/contexts/color-scheme";
import { useMantineColorScheme } from "@mantine/core";
import { useContext } from "react";
import { useSession } from "./auth";
import { setCookie } from "@/utilities/helpers/cookie-client";
import { cookieName } from "@/data/constants";
import { getExpiry } from "@/utilities/helpers/time";
import { getOSTheme } from "@/utilities/helpers/theme";

export const useColorScheme = () => {
	const colorScheme = useContext(ColorSchemeContext);

	if (!colorScheme) {
		throw new Error("useColorSchemeContext must be used within ColorSchemeProvider component");
	}

	return { colorScheme: colorScheme.colorScheme, updateColorScheme: colorScheme.setColorScheme };
};

export const useColorSchemeHandler = () => {
	const { setColorScheme } = useMantineColorScheme({ keepTransitions: true });

	const { session } = useSession();
	const { colorScheme, updateColorScheme } = useColorScheme();

	const handleChange = (value: string) => {
		updateColorScheme(value);
		setCookie(cookieName.colorSchemeState, value, {
			expiryInSeconds: getExpiry(session?.user.remember ?? false).sec,
		});

		const scheme = value == "light" ? "light" : value == "dark" ? "dark" : getOSTheme();

		setColorScheme(scheme);
		setCookie(cookieName.colorScheme, scheme, { expiryInSeconds: getExpiry(session?.user.remember ?? false).sec });
	};

	return { colorScheme, handleChange };
};

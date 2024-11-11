import { authUrls, baseUrl, name } from "@/data/constants";

export const setRedirectUrl = (currentUrl?: string, redirectUrl?: string, pathname?: string) => {
	const current = currentUrl || authUrls.signIn;
	const redirect = redirectUrl || `${baseUrl}${pathname || "/"}`;
	return `${current}?${name.urlParam.redirect}=${encodeURIComponent(redirect)}`;
};

export const getRedirectUrl = () => {
	if (typeof window !== "undefined") {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get(name.urlParam.redirect) || "/";
	}

	return "/";
};

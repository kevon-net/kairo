export const getCallbackUrlParameter = () => {
	if (typeof window !== "undefined") {
		const urlParams = new URLSearchParams(window.location.search);

		return urlParams.get("callbackUrl") || "/";
	}

	return "/";
};

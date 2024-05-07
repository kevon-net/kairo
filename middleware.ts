export { default } from "next-auth/middleware";

export const config = {
	matcher: [
		"/about",
		"/protected",
		"/protected/:path*", //use this to protect all child routes of '/protected'
	],
};

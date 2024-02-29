/** @type {import('next').NextConfig} */
const nextConfig = {
	sassOptions: {
		prependData: `@import "./styles/_mantine.scss";`,
	},

	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "placehold.co",
				port: "",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;

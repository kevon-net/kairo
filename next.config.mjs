/** @type {import('next').NextConfig} */
const nextConfig = {
	sassOptions: {
		prependData: `@import "./_mantine.scss";`,
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

	webpack: config => {
		config.externals = [...config.externals, "bcrypt"];
		return config;
	},
};

export default nextConfig;

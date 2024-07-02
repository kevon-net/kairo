const links = {
	navbar: [
		{ link: "/", label: "Home" },
		{ link: "/about", label: "About" },
		{
			link: "/features",
			label: "Features",
			subLinks: [
				{ link: "/features/1", label: "Feature 1" },
				{ link: "/features/2", label: "Feature 2" },
				{ link: "/features/3", label: "Feature 3" },
			],
		},
		{
			link: "/contact",
			label: "Contact",
		},
	],
};

export default links;

const links = {
	navbar: [
		{ link: "/", label: "Home" },
		{ link: "/about", label: "About" },
		{ link: "/blog", label: "Blog" },
		{
			link: "/contact",
			label: "Contact",
			subLinks: [
				{ link: "/docs", label: "Documentation" },
				{ link: "/resources", label: "Resources" },
				{ link: "/community", label: "Community" },
			],
		},
	],
};

export default links;

const links = {
	navbar: [
		{ link: "/", label: "Home" },
		{ link: "/about", label: "About" },
		{
			link: "/blog",
			label: "Blog",
			subLinks: [
				{ link: "/blog/1", label: "Blog 1" },
				{ link: "/blog/2", label: "Blog 2" },
				{ link: "/blog/3", label: "Blog 3" },
			],
		},
		{
			link: "/contact",
			label: "Contact",
		},
	],
};

export default links;

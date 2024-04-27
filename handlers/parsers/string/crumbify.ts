import capitalize from "./capitalize";

const crumbify = (path: string) => {
	const crumbs = [{ link: "/", label: "Home" }];

	let currentLink = "";

	path.split("/")
		.filter(crumb => crumb != "")
		.map(item => {
			currentLink += `/${item}`;
			item.length < 24 &&
				crumbs.push({
					link: currentLink,
					label: `${capitalize.words(item.replaceAll("-", " "))}`,
				});
		});

	return crumbs;
};

export default crumbify;

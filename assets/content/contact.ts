const companyName = "Next Template";
const appName = companyName;

const contact = {
	name: { company: companyName, app: appName },
	phones: [{ type: "", label: "", value: "" }],
	email: [{ type: "", value: "" }],
	socials: [
		{
			label: "twitter",
			link: "#",
		},
		{
			label: "facebook",
			link: "#",
		},
		{
			label: "instagram",
			link: "#",
		},
		{
			label: "linkedin",
			link: "#",
		},
	],
	hours: [
		{ label: "days", value: "Mon - Fri" },
		{ label: "times", value: "8 AM - 5 PM" },
	],
	locations: [
		{
			place: "Main Office",
			label: "410 Terry Ave. North, Seattle, WA 98109",
			link: "#",
		},
	],
};

export default contact;

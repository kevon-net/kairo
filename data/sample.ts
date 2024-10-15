const sampleSentence = "Lorem ipsum dolor sit amet consectetur adipiscing eli mattis.";

const sampleProse =
	"Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam neque ultrices. Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam neque ultrices. Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam neque ultrices.";

const sample = {
	text: { sentence: sampleSentence, prose: sampleProse },

	links: {
		navbar: [
			{ link: "/", label: "Home" },
			{ link: "/about", label: "About" },
			{
				link: "/services",
				label: "Services",
				subLinks: [
					{ link: "/services/1", label: "Service One" },
					{ link: "/services/2", label: "Service Two" },
					{ link: "/services/3", label: "Service Three" },
				],
			},
			{
				link: "/blog",
				label: "Blog",
			},
			{
				link: "/contact",
				label: "Contact",
			},
		],
	},

	blogPosts: [
		{
			title: "Inclusive Design: Accessible Websites for All Users",
			titleLink: "Inclusive Design",
			desc: sampleProse,
			category: "Category",
			date: "Jan 14, 2024",
		},
		{
			title: "Web Design Trends 2023: Stay Ahead of the Curve",
			titleLink: "Web Design Trends 2023",
			desc: sampleProse,
			category: "Category",
			date: "Jan 16, 2024",
		},
		{
			title: "User-Centric Web Design: Strategies for Better UI/UX",
			titleLink: "User-Centric Web Design",
			desc: sampleProse,
			category: "Category",
			date: "Jan 18, 2024",
		},
		{
			title: "Web Design Best Practices: Optimizing Speed",
			titleLink: "Web Design Best Practices",
			desc: sampleProse,
			category: "Category",
			date: "Jan 20, 2024",
		},
		{
			title: "Responsive Design: Cross-device Experience",
			titleLink: "Responsive Design",
			desc: sampleProse,
			category: "Category",
			date: "Jan 22, 2024",
		},
		{
			title: "Typography in Web Design: Enhancing UI/UX Web Apps",
			titleLink: "Typography in Web Design",
			desc: sampleProse,
			category: "Category",
			date: "Jan 24, 2024",
		},
		{
			title: "Web Development Best Practices: Optimizing Performance",
			titleLink: "Web Development Best Practices",
			desc: sampleProse,
			category: "Category",
			date: "Jan 26, 2024",
		},
	],

	faqs: [
		{
			q: "How long does a web design project take?",
			a: sampleProse,
		},
		{
			q: "What factors affect the cost of web design?",
			a: sampleProse,
		},
		{
			q: "Do you provide ongoing support?",
			a: sampleProse,
		},
		{
			q: "What is your web design process?",
			a: sampleProse,
		},
	],
};

export default sample;

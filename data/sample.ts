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

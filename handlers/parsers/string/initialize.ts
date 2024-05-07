const initialize = (words: string) =>
	words
		.split(" ")
		.map(word => word.charAt(0).toUpperCase())
		.join("");

export default initialize;

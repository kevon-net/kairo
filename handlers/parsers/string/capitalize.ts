const capitalize = {
	word: (value: string) => value.trim().toLowerCase().charAt(0).toUpperCase() + value.trim().toLowerCase().slice(1),
	words: (words: string) => words.toLowerCase().replace(/\b\w/g, char => char.toUpperCase()),
};

export default capitalize;

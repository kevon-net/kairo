import capitalize from "./capitalize";

const link = {
	linkify: (string: string) => string.toLowerCase().replaceAll(" ", "-"),
	unlinkify: (string: string) => capitalize.words(string.toLowerCase().replaceAll("-", " ")),
};

export default link;

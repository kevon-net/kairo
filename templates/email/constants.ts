import contact from "@/data/contact";

const constants = {
	year: new Date().getFullYear(),
	brand: { name: contact.name.app },
	addresses: contact.locations,
};

export default constants;

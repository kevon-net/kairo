import contact from "@/assets/content/contact";

const constants = {
	year: new Date().getFullYear(),
	brand: { name: contact.name.app },
	addresses: contact.locations,
};

export default constants;

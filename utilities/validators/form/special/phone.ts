import errors from "../errors";
import generic from "../generic";

const phone = (val: string) =>
	generic.isEmpty.string(
		val,
		() =>
			!/^(07)\d{8}$/.test(val.trim()) && errors.isInvalid("phone number")
	);

export default phone;

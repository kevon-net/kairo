import errors from "../errors";
import generic from "../generic";

const compare = {
	string: (string1: string, string2: string, fieldName: string) =>
		generic.isEmpty.string(
			string1,
			() => string1 !== string2 && errors.isMatch(fieldName)
		),

	integer: (integer1: number, integer2: number, fieldName: string) =>
		generic.isEmpty.number(
			integer1,
			() => integer1 !== integer2 && errors.isMatch(fieldName)
		),
};

export default compare;

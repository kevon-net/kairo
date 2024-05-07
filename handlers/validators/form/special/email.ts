import errors from "../errors";
import generic from "../generic";

const email = (val: string) =>
	generic.isEmpty.string(val, () => !/^\S+@\S+\.\S+$/.test(val.trim()) && errors.isInvalid("email"));

export default email;

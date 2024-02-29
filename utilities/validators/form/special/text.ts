import errors from "../errors";
import generic from "../generic";

const text = (val: string, min: number, max: number) => {
	return generic.isEmpty.string(val, () =>
		generic.hasLength.string(
			val,
			min,
			max,
			() => /[0-9]/.test(val.trim()) && errors.isText
		)
	);
};

export default text;

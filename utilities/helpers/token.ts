import { key } from "@/data/constants";
import { JwtAlgorithm } from "@/types/enums";
import { SignJWT, jwtVerify } from "jose";

export const encrypt = async (payload: any, expiryInSec?: number) =>
	await new SignJWT(payload)
		.setProtectedHeader({ alg: JwtAlgorithm.HS256 })
		.setIssuedAt()
		.setExpirationTime(new Date(Date.now() + (expiryInSec || 60 * 60) * 1000))
		.sign(key);

export const decrypt = async (token: string): Promise<any> => {
	const { payload } = await jwtVerify(token, key, { algorithms: [JwtAlgorithm.HS256] });
	return payload;
};

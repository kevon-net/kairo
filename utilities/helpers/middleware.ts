import { NextRequest, NextResponse } from "next/server";

export const runMiddleware = (
	request: NextRequest,
	response: NextResponse,
	handler: Function
) => {
	return new Promise((resolve, reject) => {
		handler(request, response, (result: any) => {
			if (result instanceof Error) {
				return reject(result);
			}

			return resolve(result);
		});
	});
};

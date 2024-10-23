import { NextRequest } from "next/server";

export const getClientIp = (request: NextRequest): string | null => {
	// Try to get the IP address from headers or the request object
	const ip = request.headers.get("X-Forwarded-For") || request.ip;
	return ip ? ip.split(",")[0].trim() : null;
};

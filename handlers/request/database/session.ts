import { Request as EnumRequest } from "@/types/enums";
import { apiUrl } from "@/data/constants";
import { SessionCreate, SessionUpdate } from "@/types/models/session";
import { authenticateHeaders } from "@/libraries/wrappers/request";

const baseRequestUrl = `${apiUrl}/sessions`;
const headers: HeadersInit = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

export const sessionsGet = async () => {
	try {
		const request = new Request(`${apiUrl}/sessions`, {
			method: EnumRequest.GET,
			credentials: "include",
			headers: await authenticateHeaders(headers),
		});

		const response = await fetch(request);

		const result = await response.json();

		return result;
	} catch (error) {
		console.error("---> handler error - (get sessions):", error);
		throw error;
	}
};

export const sessionGet = async (sessionToken: string) => {
	try {
		const request = new Request(`${apiUrl}/sessions/${sessionToken}`, {
			method: EnumRequest.GET,
			credentials: "include",
			headers: await authenticateHeaders(headers),
		});

		const response = await fetch(request);

		const result = await response.json();

		return result;
	} catch (error) {
		console.error("---> handler error - (get session):", error);
		throw error;
	}
};

export const sessionCreate = async (session: Omit<SessionCreate, "user"> & { userId: string }) => {
	try {
		const request = new Request(`${baseRequestUrl}/create`, {
			method: EnumRequest.POST,
			credentials: "include",
			headers: await authenticateHeaders(headers),
			body: JSON.stringify(session),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (create session):", error);
		throw error;
	}
};

export const sessionUpdate = async (session: SessionUpdate) => {
	try {
		const request = new Request(`${baseRequestUrl}/${session.sessionToken}`, {
			method: EnumRequest.PUT,
			credentials: "include",
			headers: await authenticateHeaders(headers),
			body: JSON.stringify(session),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (update session):", error);
		throw error;
	}
};

export const sessionDelete = async (sessionToken: string) => {
	try {
		const request = new Request(`${baseRequestUrl}/${sessionToken}`, {
			method: EnumRequest.DELETE,
			credentials: "include",
			headers: await authenticateHeaders(headers),
		});

		const response = await fetch(request);

		return response;
	} catch (error) {
		console.error("---> handler error - (delete session):", error);
		throw error;
	}
};

import { Session as SessionPayload } from "./auth";

export type Session = Omit<SessionPayload, "iat" | "exp">;

export interface ContextSession {
	session: Session | null;
	setSession: (session: Session | null) => void;
}

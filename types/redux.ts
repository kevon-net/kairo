import { Session as SessionPayload } from "./auth";

export type Session = Omit<SessionPayload, "iat" | "exp"> | null;

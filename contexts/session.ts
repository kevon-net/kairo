import { createContext } from "react";
import { ContextSession } from "@/types/context";

export const SessionContext = createContext<ContextSession | undefined>(undefined);

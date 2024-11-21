import { createContext } from "react";
import { ContextColorScheme } from "@/types/context";

export const ColorSchemeContext = createContext<ContextColorScheme | undefined>(undefined);

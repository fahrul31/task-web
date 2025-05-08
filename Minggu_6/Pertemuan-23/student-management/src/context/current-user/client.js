"use client"
import { createContext, useContext } from "react";

const CurrentUserContext = createContext();
export function useCurrentUser() {
    return useContext(CurrentUserContext)?.currentUser;
}

export default function ClientProvider({ currentUser, children }) {
    return (
        <CurrentUserContext.Provider value={{ currentUser }}>
            {children}
        </CurrentUserContext.Provider>
    );
}
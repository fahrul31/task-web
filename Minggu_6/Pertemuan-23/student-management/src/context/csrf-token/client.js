'use client'

import { createContext, useContext } from 'react';

const CsrfTokenContext = createContext();

export function useCsrfToken() {
    return useContext(CsrfTokenContext).token;
}

export default function CsrfTokenProvider({ token, children }) {

    return (
        <CsrfTokenContext.Provider value={{ token }}>
            {children}
        </CsrfTokenContext.Provider>
    )
}

'use client';
import React, { createContext, ReactNode, useState } from 'react';

export const AppContext = createContext<undefined | {}>(undefined);

type AppContextProviderProps = {
    children?: ReactNode;
};

export default function AppContextProvider(props: AppContextProviderProps){

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);

    const value ={
        backendUrl,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}


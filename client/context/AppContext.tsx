'use client';
import React, { createContext, ReactNode, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Ensure Axios sends cookies with every request
axios.defaults.withCredentials = true; 

// 1. Define the shape of User Data
interface UserData {
    userId: string;
    name: string;
    email: string;
    phoneNo: string;
    image: string;
    isAccountVerified: boolean;
}

// 2. Define the Context Type
interface AppContextType {
    backendUrl: string;
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    userData: UserData | null;
    setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
    getUserData: () => Promise<void>;
}

export const AppContext = createContext<AppContextType | any>(null);

type AppContextProviderProps = {
    children?: ReactNode;
};

export default function AppContextProvider(props: AppContextProviderProps) {

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    
    // Initial State
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);

    // 3. Function to fetch User Data (Name, Image, etc.)
    // Only called when we know the user is logged in
    const getUserData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/data`);
            
            if (data.success) {
                setUserData(data.userData); 
            } else {
                toast.error(data.message);
            }
        } catch (error: any) {
            console.log("Error fetching user data (Session might be expired):", error.message);
            // We do NOT toast here to avoid "401" popups on initial load for guests
        }
    };

    // 4. Function to check auth status on app mount
    const getAuthState = async () => {
        try {
            // Check auth status from backend
            const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
            if (data.success) {
                setIsLoggedIn(true);
                getUserData(); // Fetch user details immediately if logged in
            }
        } catch (error) {
            // Not logged in or session expired - this is normal for a guest
            setIsLoggedIn(false);
        }
    };

    // 5. Run on App Mount
    useEffect(() => {
        getAuthState();
    }, []);

    const value = {
        backendUrl,
        isLoggedIn, 
        setIsLoggedIn,
        userData, 
        setUserData,
        getUserData // Exported so Profile page can use it
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}
'use client';

import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from '@/context/AppContext';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import localFont from 'next/font/local';

const scienceGothicFont = localFont({
    src: '../../public/fonts/Science-Gothic.woff2',
    weight: '600',
    style: 'normal',
});

export default function EmailVerify() {
    const router = useRouter();
    
    // 1. Get Context Data
    type AppContextType = {
        backendUrl?: string;
        isLoggedIn?: boolean;
        userData?: any;
        getUserData?: () => void;
    };
    const { backendUrl, isLoggedIn, userData, getUserData } = useContext(AppContext) as AppContextType;

    // 2. State for OTP Inputs
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Ref to ensure OTP is sent only once on mount
    const runOnce = useRef(true);

    // 3. Auto-Send OTP on Page Load
    useEffect(() => {
        const sendOtp = async () => {
            // Only run if logged in, userData is available, and backendUrl exists
            if (isLoggedIn && userData && backendUrl && runOnce.current) {
                
                // Stop further execution if already verified
                if(userData.isAccountVerified) {
                    toast.info("Account already verified.");
                    router.push('/dashboard');
                    return;
                }

                runOnce.current = false; // Prevent double execution

                try {
                    const response = await fetch(`${backendUrl}/api/auth/sendVerificationOtp`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        // userMiddleware typically extracts userId from cookie, 
                        // but passing it here ensures compatibility if your middleware expects it in body
                        body: JSON.stringify({ userId: userData.userId }), 
                    });

                    const data = await response.json();

                    if (response.ok) {
                        toast.success(data.message || "OTP sent to your email.");
                    } else {
                        toast.error(data.message || "Failed to send OTP.");
                    }
                } catch (error) {
                    console.error("Error sending OTP:", error);
                    toast.error("Could not send verification email.");
                }
            }
        }

        sendOtp();
    }, [isLoggedIn, userData, backendUrl, router]);

    // 4. Handle Input Change (Typing)
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // 5. Handle Backspace (Navigation)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // 6. Handle Paste (UX Improvement)
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pasteData)) return;

        const newOtp = [...otp];
        pasteData.split('').forEach((char, i) => {
            if (i < 6) newOtp[i] = char;
        });
        setOtp(newOtp);

        const focusIndex = Math.min(pasteData.length - 1, 5);
        inputRefs.current[focusIndex]?.focus();
    };

    // 7. Handle Form Submission (Verify OTP)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            toast.error("Please enter the 6-digit code.");
            return;
        }

        if (!userData || !userData.userId) {
            toast.error("User data missing. Please login again.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${backendUrl}/api/auth/verifyAccount`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ userId: userData.userId, otp: otpCode }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Verification failed");
            } else {
                toast.success("Email verified successfully!");
                // Refresh user data globally
                if (getUserData) {
                    getUserData();
                }
                // Redirect to dashboard
                router.push('/dashboard');
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-200 to-purple-400">
             {/* Logo / Header */}
             <div className="absolute top-0 left-0 p-10 flex items-center">
                 <img src="/logo.svg" alt="" className='w-16' />
                 <p className='text-black text-xl font-bold ml-2'>EcoMoney</p>
             </div>

            <form className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm text-center" onSubmit={handleSubmit}>
                <h1 className={`text-2xl ${scienceGothicFont.className} font-bold text-white mb-4`}>Email Verification</h1>
                <p className="text-gray-400 mb-6">Enter the 6-digit code sent to your email.</p>

                <div className="flex justify-between mb-8" onPaste={handlePaste}>
                    {Array(6).fill(0).map((_, index) => (
                        <input
                            key={index}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            placeholder="0"
                            title={`Digit ${index + 1} of OTP`}
                            ref={el => { inputRefs.current[index] = el; }}
                            value={otp[index]}
                            onChange={(e) => handleInput(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            required
                            className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent"
                        />
                    ))}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-linear-to-br from-indigo-500 to-indigo-900 hover:from-indigo-600 hover:to-indigo-950 text-white py-3 rounded-full font-medium transition-all"
                >
                    {loading ? 'Verifying...' : 'Verify Email'}
                </button>
            </form>
        </div>
    )
}
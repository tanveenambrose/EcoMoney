'use client';
import Link from 'next/link';
import localFont from 'next/font/local';
import { useContext, useState } from "react";
import { AppContext } from '@/context/AppContext';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const scienceGothicFont = localFont({
    src: '../../public/fonts/Science-Gothic.woff2',
    weight: '600',
    style: 'normal',
});

export default function Login() {
    const router = useRouter();

    type AppContextType = {
        backendUrl?: string;
        isLoggedIn?: boolean;
        setIsLoggedIn?: (v: boolean) => void;
        userData?: any;
        setUserData?: (d: any) => void;
    };
    const { backendUrl, setIsLoggedIn, setUserData } = useContext(AppContext) as AppContextType;

    const [state, setState] = useState('Login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${backendUrl}` + '/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || 'Login failed.');
            } else {
                toast.success("Login Successful!");
                setIsLoggedIn?.(true);
                setUserData?.({ userId: data.userId, email });
                router.push('/dashboard');
            }
        } catch (err) {
            toast.error('An error occurred during login.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        console.log('Sign up request to:', `${backendUrl}/api/auth/signup`);
        
        try {
            const response = await fetch(`${backendUrl}` + '/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name, phoneNo, email, password }),
            });

            let data;
            const contentType = response.headers.get("content-type");
            
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text();
                console.error("Sign Up Server Error (Text Response):", text);
                toast.error(`Server Error: ${response.status}. Check console.`);
                return;
            }

            if (!response.ok) {
                // FIXED: Now showing data.error if available
                console.error("Server Error Details:", data);
                const errorMessage = data.error ? `${data.message}: ${data.error}` : data.message;
                toast.error(errorMessage || 'Sign up failed');
            } else {
                toast.success("Account created successfully!");
                setIsLoggedIn?.(true);
                setUserData?.({ userId: data.userId, email, name, phoneNo });
                router.push('/email-verify');
            }
        } catch (err) {
            console.error("Sign up error:", err);
            toast.error('Connection failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className='flex bg-white pl-10 items-center'>
                <Link href='/home' className='flex items-center' >
                    <img src="/logo.svg" alt="" className='w-16' />
                    <p className='text-black'>EcoMoney</p>
                </Link>
            </div>
            <div className="min-h-screen bg-linear-to-br from-blue-300 to-purple-600 flex items-center justify-center bg-white px-4">
                <div className='text-center bg-slate-900 p-10 rounded-3xl shadow-xl w-full max-w-md'>
                    <h1 className={`text-4xl  ${scienceGothicFont.className} font-bold text-white`}>{state === 'Login' ? 'Login' : 'Sign Up'}</h1>
                    <p className='text-md font-semibold pb-4 text-gray-400'>{state === 'Login' ? 'Login to your account' : 'Create your account'}</p>

                    {state === 'Login' ?
                        (
                            <form onSubmit={handleLogin}>
                                <div className='mt-4 flex items-center gap-3 w-full px-5 py-1 rounded-full bg-[#333A5C]' >
                                    <img src='/assests/mail_icon.svg' alt="" />
                                    <input
                                        type="email"
                                        placeholder='Email' className='w-full px-4 py-2 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-transparent
                                    border-none'
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className='mt-4 flex items-center gap-3 w-full px-5 py-1 rounded-full bg-[#333A5C]' >
                                    <img src='/assests/lock_icon.svg' alt="" />
                                    <input
                                        type="password"
                                        placeholder='Password' className='w-full px-4 py-2 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border-none'
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <Link href='/reset-password'>
                                    <p className='text-white pt-6 pb-4 hover:text-red-700 text-left cursor-pointer'>Forgot Password ?</p>
                                </Link>
                                <button type="submit" disabled={loading} className='w-full mt-3 p-2.5 rounded-full bg-linear-to-br from-indigo-500 to-indigo-900'>
                                    {loading ? 'Loading...' : 'Login'}
                                </button>
                            </form>
                        ) :
                        (
                            <form onSubmit={handleSignUp}>
                                <div className='mt-4 flex items-center gap-3 w-full px-5 py-1 rounded-full bg-[#333A5C]' >
                                    <img src='/assests/person_icon.svg' alt="" />
                                    <input
                                        type="text"
                                        placeholder='Full Name' className='w-full px-4 py-2 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-transparent
                                    border-none'
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className='mt-4 flex items-center gap-3 w-full px-5 py-1 rounded-full bg-[#333A5C]' >
                                    <img src='/assests/mail_icon.svg' alt="" />
                                    <input
                                        type="email"
                                        placeholder='Email' className='w-full px-4 py-2 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-transparent
                                    border-none'
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className='mt-4 flex items-center gap-3 w-full px-5 py-1 rounded-full bg-[#333A5C]' >
                                    <img src='/assests/lock_icon.svg' alt="" />
                                    <input
                                        type="password"
                                        placeholder='Password' className='w-full px-4 py-2 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border-none'
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className='mt-4 flex items-center gap-3 w-full px-5 py-1 rounded-full bg-[#333A5C]'>
                                    <img src='/assests/person_icon.svg' alt="" />
                                    <input
                                        type="text"
                                        placeholder='Phone No' className='w-full px-4 py-2 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-transparent
                                    border-none'
                                        required
                                        value={phoneNo}
                                        onChange={(e) => setPhoneNo(e.target.value)}
                                    />
                                </div>
                                <Link href='/reset-password'>
                                    <p className='text-white pt-6 pb-4 hover:text-red-700 text-left cursor-pointer'>Forgot Password ?</p>
                                </Link>
                                <button type="submit" disabled={loading} className='w-full mt-3 p-2.5 rounded-full bg-linear-to-br from-indigo-500 to-indigo-900'>
                                    {loading ? 'Loading...' : 'Sign Up'}
                                </button>
                            </form>
                        )
                    }

                    {state === 'Login' ?
                        (
                            <p className='mt-4'>Don't Have an Account ? {' '}
                                <span onClick={() => setState('Sign Up')} className='text-lg text-blue-400 font-semibold hover:underline cursor-pointer'>
                                    Sign Up
                                </span>{' '}
                                here !
                            </p>
                        ) : (
                            <p className='mt-4'>Already Have an Account ? {' '}
                                <span onClick={() => setState('Login')} className='text-lg text-blue-400 font-semibold hover:underline cursor-pointer'>
                                    Login
                                </span>{' '}
                                here !
                            </p>
                        )
                    }

                </div>
            </div>
        </>
    );
}
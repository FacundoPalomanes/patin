"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import patinIcon from '../public/patin_icon.png';
import { UserState } from "../interface/UserState";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from 'axios';
import NotificationBell from '../public/bell-svgrepo-com.svg'

interface NavbarProps {
    user: UserState
}

interface Notification {
    sender?: {
        name: string;
        surname: string;
        photoURL: string;
    };
    description: string;
    createdAt: string;
}

export default function Navbar({ user }: NavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const router = useRouter()


    const pathname = usePathname();
    console.log(pathname)

    useEffect(() => {
        getNotifications();
    }, [])

    async function signOut() {
        try {
            await axios.get(`${process.env.NEXT_PUBLIC_FETCH_URL}/auth/logout`, {
                withCredentials: true
            })

            router.push('/login');
        } catch (error) {
            console.error('Hubo un error cerrando la sesion ', error)
            router.push('/login');
        }
    }

    async function getNotifications() {
        try {
            const cookie = await axios.get(`${process.env.NEXT_PUBLIC_FETCH_URL}/auth/cookiesProfile`, {
                withCredentials: true,
            });

            const jwt = cookie.data.token;
            // Hacer la request con el JWT en el header Authorization
            const res = await axios(`${process.env.NEXT_PUBLIC_FETCH_URL}/notifications/getNotifications`, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${jwt}`,
                },
                withCredentials: true, // Envia las cookies al backend
            });

            setNotifications(res.data);
        } catch (error) {
            console.error("Hubo un error obteniendo las notificaciones: ", error)
            setError("Hubo un error al intentar traer las notificaciones, recargue la página");
        }
    }

    return (
        <nav className="bg-gray-900 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <Image width={500} height={500} className="h-8 w-auto" src={patinIcon} alt="Logo" />
                            <span className="ml-2 text-xl font-bold">Nac Patin</span>
                        </Link>
                        <div className="hidden md:ml-6 md:flex md:space-x-8">
                            <Link href="/" className={`px-1 pt-1 inline-flex items-center text-sm font-medium border-b-2 ${pathname === '/' ? "text-white border-indigo-500" : "text-gray-300 hover:text-white hover:border-gray-300 border-transparent"}`}>
                                Inicio
                            </Link>
                            <Link href="#" className={`px-1 pt-1 inline-flex items-center text-sm font-medium border-b-2 ${pathname === 'PATH PERSONALIZADO' ? "text-white border-indigo-500" : "text-gray-300 hover:text-white hover:border-gray-300 border-transparent"}`}>
                                ????? {/* Team */}
                            </Link>
                            <Link href="#" className={`px-1 pt-1 inline-flex items-center text-sm font-medium border-b-2 ${pathname === 'PATH PERSONALIZADO' ? "text-white border-indigo-500" : "text-gray-300 hover:text-white hover:border-gray-300 border-transparent"}`}>
                                ????? {/* Projects */}
                            </Link>
                            
                            
                            <Link href="#" className={`px-1 pt-1 inline-flex items-center text-sm font-medium border-b-2 ${pathname === 'PATH PERSONALIZADO' ? "text-white border-indigo-500" : "text-gray-300 hover:text-white hover:border-gray-300 border-transparent"}`}>
                                ????? {/* Calendar */}
                            </Link>
                            
                        </div>
                    </div>

                    <div className="flex items-center">
                        {/* Create post button */}
                        <div
                            className="mx-3  relative"
                        >
                            <Image src={NotificationBell} onClick={() => setNotificationOpen(prev => !prev)} className="hover:cursor-pointer" width={15} height={15} alt="Notification Bell" />
                            <AnimatePresence>
                                {notificationOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-2 top-8 w-80 bg-gray-200 shadow-lg rounded-lg p-4 z-50"
                                    >
                                        <h4 className="font-semibold text-gray-900 mb-3 text-center text-base">Notificaciones</h4>
                                        <ul className="space-y-4 max-h-80 overflow-y-auto">
                                            {error != null ? (
                                                error
                                            ) : notifications.length === 0 ? (
                                                <li className="text-center text-gray-600">No hay notificaciones</li>
                                            ) : (
                                                notifications.map((notif, index) => (
                                                    <li key={index} className="bg-gray-100 rounded-md p-3 shadow-sm hover:bg-gray-50 transition-all">
                                                        {notif.sender && (
                                                            <div className="flex items-start">
                                                                <Image
                                                                    src={`${user.photoURL}?cacheBust=${Date.now()}`}
                                                                    width={32}
                                                                    height={32}
                                                                    alt="Foto"
                                                                    className="w-8 h-8 rounded-full object-cover mr-3 mt-0.5"
                                                                />
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-semibold text-gray-800">
                                                                        {notif.sender.name} {notif.sender.surname}
                                                                    </span>
                                                                    <span className="text-xs text-gray-500 mt-0.5">
                                                                        {new Date(notif.createdAt).toLocaleString("es-ES", {
                                                                            day: "numeric",
                                                                            month: "long",
                                                                            year: "numeric",
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                        })}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <p className="text-sm text-gray-700 mt-2">{notif.description}</p>
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                    </motion.div>
                                )}
                            </AnimatePresence>


                        </div>


                        {/* Profile dropdown */}
                        <div className="ml-3 relative hidden md:block">


                            <div>
                                <button
                                    onClick={() => setUserMenuOpen(prev => !prev)}
                                    type="button"
                                    className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white hover:cursor-pointer"
                                    aria-expanded={userMenuOpen}
                                    aria-haspopup="true"
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <Image
                                        className="h-9 w-8 rounded-full object-cover"
                                        src={`${user.photoURL}?cacheBust=${Date.now()}`}
                                        width={32}
                                        height={32}
                                        alt="User Profile"
                                    />
                                </button>
                            </div>

                            {/* User Dropdown Animated */}
                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                        role="menu"
                                        aria-orientation="vertical"
                                    >
                                        {user.admin ? <Link href={"/add"} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Admin</Link> : null }
                                        <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Configuracion</Link>
                                        <Link href="#" onClick={signOut} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Cerrar Sesion</Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex items-center md:hidden ml-4">
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(prev => !prev)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                aria-expanded={mobileMenuOpen}
                            >
                                <span className="sr-only">Open main menu</span>
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Animated */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-gray-900 overflow-hidden"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link href="/" className={`${pathname === '/' ? "bg-gray-800 text-white" : "text-gray-300"} block px-3 py-2 rounded-md text-base font-medium`}>Inicio</Link>
                            <Link href="#" className={`${pathname === 'PAGINA X' ? "bg-gray-800 text-white" : "text-gray-300"} block px-3 py-2 rounded-md text-base font-medium`}>?????</Link>
                            <Link href="#" className={`${pathname === 'PAGINA X' ? "bg-gray-800 text-white" : "text-gray-300"} block px-3 py-2 rounded-md text-base font-medium`}>?????</Link>
                            <Link href="#" className={`${pathname === 'PAGINA X' ? "bg-gray-800 text-white" : "text-gray-300"} block px-3 py-2 rounded-md text-base font-medium`}>?????</Link>
                        </div>

                        {/* Mobile profile */}
                        <div className="pt-4 pb-3 border-t border-gray-700">
                            <div className="flex items-center px-5">
                                <div className="flex-shrink-0">
                                    <Image
                                        className="h-10 w-10 rounded-full object-cover"
                                        src={`${user.photoURL}?cacheBust=${Date.now()}`}
                                        width={40}
                                        height={40}
                                        alt="User Mobile Profile"
                                    />
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-white">{user.name} {user.surname}</div>
                                    <div className="text-sm font-medium text-gray-400">{user.email}</div>
                                </div>
                            </div>
                            <div className="mt-3 px-2 space-y-1">
                                {user.admin ? <Link href="/add" className={`block px-3 py-2 rounded-md text-base font-medium hover:text-white hover:bg-gray-700 ${pathname === '/add' ? "text-white" : "text-gray-400"}`}>Admin</Link> : null }
                                <Link href="/settings" className={`block px-3 py-2 rounded-md text-base font-medium hover:text-white hover:bg-gray-700 ${pathname === '/settings' ? "text-white" : "text-gray-400"}`}>Configuracion</Link>
                                <Link href="#" onClick={signOut} className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">Cerrar Sesion</Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav >
    );
}

import { useRef } from 'react';
import { motion } from 'framer-motion';

type AuthTabsProps = {
    activeTab: "login" | "register";
    setActiveTab: (tab: 'login' | 'register') => void;
}

export default function AuthTabs({ activeTab, setActiveTab }: AuthTabsProps) {
    const loginRef = useRef<HTMLElement>(null);
    const registerRef = useRef<HTMLElement>(null);

    const handleClick = (tab: 'login' | 'register') => {
        setActiveTab(tab);
        const target = tab === 'login' ? loginRef.current : registerRef.current;
        target?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="w-full max-w-md mx-auto mt-10">
            <div className="relative flex justify-center gap-4 rounded-full p-1 ">
                <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className={`bottom-1/25 hover:cursor-pointer absolute w-1/2 h-full bg-white rounded-full shadow-md z-0 ${activeTab === 'login' ? 'left-0' : 'left-1/2'}`}
                />
                <button onClick={() => handleClick('login')} className={`hover:cursor-pointer relative z-10 w-1/2 py-2 font-semibold rounded-full transition-colors ${activeTab === 'login' ? 'text-black' : 'text-gray-500'}`}>
                    Iniciar sesión
                </button>
                <button onClick={() => handleClick('register')} className={`hover:cursor-pointer relative z-10 w-1/2 py-2 font-semibold rounded-full transition-colors ${activeTab === 'register' ? 'text-black' : 'text-gray-500'}`}>
                    Registrarse
                </button>
            </div>
        </div>
    );
}

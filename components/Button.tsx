// components/AnimatedButton.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Check from '../public/check.svg';
import X from '../public/x.svg';
import Image from "next/image";

type Status = "idle" | "loading" | "success" | "error";

interface AnimatedButtonProps {
    initialText: string;
    onClick?: () => Promise<boolean>; // ahora opcional
    type: "button" | "submit" | "reset";
    externalStatus?: Status;
}

export default function Button({ initialText, onClick, type, externalStatus }: AnimatedButtonProps) {
    const [status, setStatus] = useState<Status>("idle");

    const handleClick = async () => {
        if (!onClick) return; // evita romper si no se pasa onClick
        setStatus("loading");
        try {
            const result = await onClick();
            setStatus(result ? "success" : "error");
        } catch {
            setStatus("error");
        }
    };

    useEffect(() => {
        if (status === "success" || status === "error") {
            const timeout = setTimeout(() => setStatus("idle"), 2000);
            return () => clearTimeout(timeout);
        }
    }, [status]);

    useEffect(() => {
        if (externalStatus) {
            setStatus(externalStatus);
        }
    }, [externalStatus]);

    return (
        <button
            key={status} // fuerza re-render y evita freeze
            type={type}
            onClick={handleClick}
            disabled={status === "loading"}
            className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 hover:cursor-pointer
                ${status === 'idle' && "bg-blue-600 hover:bg-blue-700"} ${status === 'loading' && "bg-blue-500 cursor-not-allowed"} ${status === 'success' && "bg-green-600"} ${status === 'error' && "bg-red-600"}`}
        >
            <AnimatePresence initial={false} mode="wait">
                {status === "idle" && (
                    <motion.span
                        key="idle"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                    >
                        {initialText}
                    </motion.span>
                )}

                {status === "loading" && (
                    <motion.div
                        key="loading"
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />
                )}

                {status === "success" && (
                    <motion.div
                        key="success"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Image src={Check} alt="Check Icon" width={30} height={30} />
                    </motion.div>
                )}

                {status === "error" && (
                    <motion.div
                        key="error"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Image src={X} alt="X Icon" width={30} height={30} />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
}

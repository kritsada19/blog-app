"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useState } from "react"
import { FaBars } from "react-icons/fa"

export default function NavLinks() {
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const navItems = [
        { name: "Home", path: "/posts" },
        { name: "Dashboard", path: "/dashboard" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
    ]

    return (
        <div className="relative">
            <div className="flex items-center space-x-10">
                {/* DESKTOP */}
                <div className="hidden md:flex space-x-6">
                    {navItems.map(item => {
                        const isActive = pathname === item.path

                        return (
                            <div key={item.path} className="relative">
                                <Link href={item.path}>
                                    <span
                                        className={
                                            isActive
                                                ? "text-emerald-400"
                                                : "text-gray-300"
                                        }
                                    >
                                        {item.name}
                                    </span>
                                </Link>

                                {isActive && (
                                    <motion.div
                                        layoutId="underline"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-emerald-400"
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30,
                                        }}
                                    />
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* HAMBURGER */}
                <button
                    className="md:hidden text-lg text-gray-100 hover:text-emerald-500"
                    onClick={() => setIsMenuOpen(v => !v)}
                >
                    <FaBars />
                </button>
            </div>

            {/* MOBILE MENU */}
            <div
                className={`fixed left-0 right-0 top-14 z-50 md:hidden
                overflow-hidden transition-all duration-300
                ${isMenuOpen ? "max-h-screen" : "max-h-0"}`}
            >
                <ul className="mx-auto mt-4 w-full max-w-md flex flex-col items-center gap-4 rounded-xl bg-black/90 py-4">
                    {navItems.map(item => (
                        <li key={item.path}>
                            <Link
                                href={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={
                                    pathname === item.path
                                        ? "text-emerald-400"
                                        : "text-gray-300"
                                }
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

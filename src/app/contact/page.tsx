import Link from "next/link";
import { FaGithub, FaEnvelope, FaPhone } from "react-icons/fa";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-black text-emerald-400 flex items-center justify-center px-4">
            <div className="w-full max-w-3xl bg-zinc-900 rounded-2xl shadow-lg px-8 py-12">
                
                {/* header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-emerald-500 mb-2">
                        Contact Me
                    </h1>
                    <p className="text-gray-400">
                        ช่องทางติดต่อและติดตามผลงาน
                    </p>
                </div>

                {/* contact cards */}
                <div className="grid gap-6 md:grid-cols-3">

                    {/* email */}
                    <a
                        href="mailto:your@email.com"
                        className="group rounded-xl border border-zinc-700 p-6 hover:border-emerald-500 transition"
                    >
                        <FaEnvelope className="text-3xl mb-4 text-emerald-500 group-hover:scale-110 transition" />
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="font-semibold">ninep9p2006@email.com</p>
                    </a>

                    {/* phone */}
                    <a
                        href="tel:0885578023"
                        className="group rounded-xl border border-zinc-700 p-6 hover:border-emerald-500 transition"
                    >
                        <FaPhone className="text-3xl mb-4 text-emerald-500 group-hover:scale-110 transition" />
                        <p className="text-sm text-gray-400">Phone</p>
                        <p className="font-semibold">088-557-8023</p>
                    </a>

                    {/* github */}
                    <Link
                        href="https://github.com/kritsada19"
                        target="_blank"
                        className="group rounded-xl border border-zinc-700 p-6 hover:border-emerald-500 transition"
                    >
                        <FaGithub className="text-3xl mb-4 text-emerald-500 group-hover:scale-110 transition" />
                        <p className="text-sm text-gray-400">GitHub</p>
                        <p className="font-semibold">github.com/kritsada19</p>
                    </Link>
                </div>

                {/* footer text */}
                <div className="mt-10 text-center text-sm text-gray-500">
                    Available for freelance & collaboration
                </div>
            </div>
        </div>
    );
}

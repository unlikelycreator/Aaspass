import React, { useState } from "react";

import {
    ShieldCheck,
    Database,
    LockKeyhole,
    HardDriveDownload,
} from "lucide-react";
import QR from '../assets/qr.jpeg'
export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [donateOpen, setDonateOpen] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState(100);
    const handleLogin = () => {
        if (
            username === "admin" &&
            password === "admin"
        ) {
            localStorage.setItem(
                "isAuthenticated",
                "true"
            );

            window.location.reload();
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f7fb] text-black flex items-center justify-center overflow-hidden relative">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-3xl rounded-full" />

            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-3xl rounded-full" />

            <div className="w-full max-w-6xl px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-center relative z-10">

                {/* LEFT SECTION */}
                <div className="hidden lg:block space-y-8">
                    <div>
                        {/* FREE FOREVER BADGE */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold mb-4">
                            <ShieldCheck size={12} />
                            Completely Free Forever • No Limits • No Restrictions
                        </div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 bg-white text-[11px] tracking-wide uppercase text-neutral-600 mb-5 shadow-sm">
                            <ShieldCheck size={14} />
                            Secure Local Credential Vault
                        </div>

                        <h1 className="text-5xl font-black leading-tight tracking-tight text-neutral-900">
                            Password
                            <span className="text-neutral-500">
                                {" "}
                                Management
                            </span>
                            <br />
                            For Infrastructure Teams
                        </h1>

                        <p className="mt-5 text-sm leading-7 text-neutral-600 max-w-xl">
                            Securely manage server credentials,
                            SQL access, SSH secrets, API tokens,
                            infrastructure metadata and sensitive
                            operational information in a fully
                            local-first environment.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            {
                                icon: <LockKeyhole size={18} />,
                                title: "Encrypted Storage",
                                desc: "Credentials stored locally using secure browser-based persistence.",
                            },
                            {
                                icon: <Database size={18} />,
                                title: "IndexedDB Persistence",
                                desc: "Local vault persistence with fast structured access and offline capability.",
                            },
                            {
                                icon: <HardDriveDownload size={18} />,
                                title: "Secure Export Workflow",
                                desc: "Export credential vaults into local backup files during logout events.",
                            },
                            {
                                icon: <ShieldCheck size={18} />,
                                title: "Local First Security",
                                desc: "No cloud dependency. No external credential synchronization.",
                            },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center mb-4 text-neutral-700">
                                    {item.icon}
                                </div>

                                <h3 className="font-semibold text-sm mb-2 text-neutral-900">
                                    {item.title}
                                </h3>

                                <p className="text-xs text-neutral-500 leading-6">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Bullet Points */}
                    <div className="space-y-3">
                        <div className="text-xs uppercase tracking-[0.3em] text-neutral-400">
                            Platform Highlights
                        </div>

                        <div className="grid sm:grid-cols-2 gap-y-3 text-sm text-neutral-700">
                            <div>
                                • Server Credential Management
                            </div>

                            <div>
                                • SQL & Database Secrets
                            </div>

                            <div>
                                • SSH & Infrastructure Access
                            </div>

                            <div>
                                • Secure Local Vault Workflow
                            </div>

                            <div>
                                • Offline Persistence
                            </div>

                            <div>
                                • Encrypted JSON Backups
                            </div>
                        </div>
                    </div>

                    {/* DONATE BUTTON */}
                    <button
                        onClick={() => setDonateOpen(true)}
                        className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white text-sm font-semibold hover:opacity-90 transition-all"
                    >
                        <span>❤️</span>
                        Support / Donate
                    </button>

                    <div className="mt-6">
                        <a
                            href="https://www.producthunt.com/products/aaspass?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-aaspass"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block transition-transform hover:scale-[1.02]"
                        >
                            <img
                                alt="AasPass - Secure your infra secrets locally—without the cloud. | Product Hunt"
                                width="250"
                                height="54"
                                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1153987&theme=neutral&t=1779535011993"
                            />
                        </a>
                    </div>
                </div>

                {/* MOBILE HEADER */}
                <div className="lg:hidden mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 bg-white text-[10px] tracking-wide uppercase text-neutral-600 mb-4 shadow-sm">
                        <ShieldCheck size={12} />
                        Secure Local Vault
                    </div>

                    <h1 className="text-3xl font-black leading-tight tracking-tight text-neutral-900">
                        Password Vault
                    </h1>

                    <p className="mt-3 text-xs leading-6 text-neutral-500">
                        Local-first credential management for
                        infrastructure, databases, SSH access and
                        operational secrets.
                    </p>
                </div>

                {/* RIGHT SECTION */}
                <div className="flex justify-center lg:justify-end w-full">
                    <div className="w-full max-w-md rounded-3xl border border-black/5 bg-white shadow-2xl p-6 sm:p-8">
                        <div className="mb-8">
                            <div className="text-xs uppercase tracking-[0.25em] text-neutral-400 mb-3">
                                Authentication
                            </div>

                            <h2 className="text-3xl font-bold mb-2 text-neutral-900">
                                Access Vault
                            </h2>

                            <p className="text-sm text-neutral-500 leading-6">
                                Authenticate to continue to the
                                secure local credential management
                                workspace.
                            </p>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="text-xs uppercase tracking-wide text-neutral-500 block mb-2">
                                    Username
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    className="w-full h-12 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none focus:border-black transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-xs uppercase tracking-wide text-neutral-500 block mb-2">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="w-full h-12 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm outline-none focus:border-black transition-all"
                                />
                            </div>

                            <button
                                onClick={handleLogin}
                                className="w-full h-12 rounded-xl bg-black text-white font-semibold text-sm hover:opacity-90 transition-all"
                            >
                                Authenticate & Continue
                            </button>
                        </div>

                        {/* Footer Info */}
                        <div className="mt-8 pt-6 border-t border-neutral-200 space-y-3">
                            <div className="flex items-center justify-between text-xs text-neutral-500">
                                <span>Environment</span>
                                <span>LOCAL SECURE MODE</span>
                            </div>

                            <div className="flex items-center justify-between text-xs text-neutral-500">
                                <span>Storage Engine</span>
                                <span>IndexedDB</span>
                            </div>

                            <div className="flex items-center justify-between text-xs text-neutral-500">
                                <span>Backup Strategy</span>
                                <span>JSON EXPORT</span>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="mt-8 text-center text-[11px] text-neutral-400 leading-5">
                            © 2026 DumbSoft Systems.
                            <br />
                            Secure Credential Infrastructure
                            Platform.
                        </div>
                    </div>
                </div>
            </div>
            {/* ================= DONATION MODAL ================= */}
            {donateOpen && (
                <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border p-6 relative">

                        <button
                            onClick={() => setDonateOpen(false)}
                            className="absolute top-4 right-4 text-neutral-500 hover:text-black"
                        >
                            ×
                        </button>

                        <h2 className="text-xl font-bold mb-2">
                            Support This Project ❤️
                        </h2>

                        <p className="text-sm text-neutral-500 mb-4">
                            Completely free tool. You can optionally support development.
                        </p>

                        {/* AMOUNTS */}
                        <div className="grid grid-cols-3 gap-2 mb-5">
                            {[25, 50, 100, 500, 1000].map((amt) => (
                                <button
                                    key={amt}
                                    onClick={() => setSelectedAmount(amt)}
                                    className={`h-10 rounded-xl border text-sm font-semibold ${selectedAmount === amt
                                        ? "bg-black text-white"
                                        : "bg-white hover:bg-neutral-50"
                                        }`}
                                >
                                    ₹{amt}
                                </button>
                            ))}
                        </div>

                        {/* QR PLACEHOLDER */}
                        <div className="flex flex-col items-center gap-2 mb-4">
                            <img
                                src={QR}   // 👈 put your image path here
                                alt="UPI QR Code"
                                className="w-40 h-40 border rounded-xl object-contain bg-white"
                            />

                            <div className="text-xs text-neutral-500">
                                UPI ID: <span className="font-semibold">pawarhritik2700@okhdfcbank</span>
                            </div>

                            <div className="text-sm font-semibold">
                                Amount: ₹{selectedAmount}
                            </div>
                        </div>

                        <button className="w-full h-11 rounded-xl bg-black text-white font-semibold">
                            Pay via UPI
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
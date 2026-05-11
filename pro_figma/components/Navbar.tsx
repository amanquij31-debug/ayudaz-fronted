"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

interface NavbarProps {
    onNuevaSolicitud: () => void;
    puedeCrearSolicitud?: boolean;
}

export default function Navbar({
    onNuevaSolicitud,
    puedeCrearSolicitud = true
}: NavbarProps) {

    const { user, isGuest, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    const displayName = isGuest
        ? "Invitado"
        : user?.displayName ?? user?.email ?? "Usuario";

    return (
        <nav
            style={{
                position: "sticky",
                top: 0,
                zIndex: 50,
                background: "var(--surface)",
                borderBottom: "1px solid var(--border)",
                padding: "0 24px",
                height: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            {/* Left */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                    onClick={() => router.push("/")}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            background: "#0f1117",
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="white"
                        >
                            <path d="M12 21C12 21 3 14 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14 14 21 12 21Z" />
                        </svg>
                    </div>

                    <span
                        style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: "var(--text-primary)",
                        }}
                    >
                        Ayuda Z
                    </span>
                </button>
            </div>

            {/* Right */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

                {/* User */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 14px",
                        border: "1.5px solid var(--border)",
                        borderRadius: "var(--radius-full)",
                        fontSize: 14,
                        color: "var(--text-secondary)",
                    }}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>

                    {displayName}
                </div>

                {/* Nueva Solicitud */}
                {!isGuest && puedeCrearSolicitud && (
                    <button
                        onClick={onNuevaSolicitud}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "8px 16px",
                            background: "var(--text-primary)",
                            border: "none",
                            borderRadius: "var(--radius-full)",
                            fontSize: 14,
                            fontWeight: 600,
                            color: "white",
                            cursor: "pointer",
                            transition: "opacity 0.15s",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.opacity = "0.85")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.opacity = "1")
                        }
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                        >
                            <path d="M12 5v14M5 12h14" />
                        </svg>

                        Nueva Solicitud
                    </button>
                )}

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    title="Cerrar sesión"
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--text-muted)",
                        padding: 6,
                    }}
                >
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                    </svg>
                </button>
            </div>
        </nav>
    );
}
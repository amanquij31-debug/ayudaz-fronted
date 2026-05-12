"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {

    const router = useRouter();

    useEffect(() => {

        const token =
            localStorage.getItem(
                "token"
            );

        if (!token) {

            router.push(
                "/admin/login"
            );
        }

    }, []);

    // =========================
    // CERRAR SESIÓN
    // =========================

    const cerrarSesion = () => {

        localStorage.removeItem(
            "token"
        );

        router.push(
            "/admin/login"
        );
    };

    return (

        <div
            style={{
                minHeight: "100vh",
                background: "#f5f7fb",
                padding: 32,
            }}
        >

            {/* HEADER */}

            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    marginBottom: 32,
                }}
            >

                <h1
                    style={{
                        fontSize: 28,
                        fontWeight: 800,
                    }}
                >
                    Panel Administrativo
                </h1>

                {/* BOTÓN LOGOUT */}

                <button
                    onClick={cerrarSesion}
                    style={{
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        borderRadius: 10,
                        padding:
                            "10px 18px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: 14,
                    }}
                >
                    Cerrar sesión
                </button>

            </div>

            {/* CARDS */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "1fr 1fr",
                    gap: 20,
                }}
            >

                <button
                    onClick={() =>
                        router.push(
                            "/admin/usuarios"
                        )
                    }
                    style={card}
                >
                    Administrar Usuarios
                </button>

                <button
                    onClick={() =>
                        router.push(
                            "/admin/solicitudes"
                        )
                    }
                    style={card}
                >
                    Administrar Solicitudes
                </button>

            </div>

        </div>
    );
}

const card: React.CSSProperties = {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 32,
    cursor: "pointer",
    fontSize: 18,
    fontWeight: 700,
    transition: "0.2s",
};
"use client";

import {
    useEffect,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

export default function AdminLoginPage() {

    const router = useRouter();

    const [correo, setCorreo] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    // =========================
    // REDIRIGIR SI YA LOGUEÓ
    // =========================

    useEffect(() => {

        const token =
            localStorage.getItem(
                "token"
            );

        if (token) {

            router.push(
                "/admin/dashboard"
            );
        }

    }, []);

    // =========================
    // LOGIN
    // =========================

    const login = async () => {

        try {

            if (
                !correo.trim() ||
                !password.trim()
            ) {

                setError(
                    "Completa todos los campos"
                );

                return;
            }

            setLoading(true);

            setError("");

            const data =
                await api.loginAdmin(
                    correo,
                    password
                );

            localStorage.setItem(
                "token",
                data.token
            );

            router.push(
                "/admin/dashboard"
            );

        } catch (err: any) {

            setError(
                err.message ||
                "Credenciales inválidas"
            );

        } finally {

            setLoading(false);
        }
    };

    // =========================
    // ENTER LOGIN
    // =========================

    const handleKeyDown = (
        e: React.KeyboardEvent
    ) => {

        if (e.key === "Enter") {

            login();
        }
    };

    return (

        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent:
                    "center",
                alignItems: "center",
                background: "#f3f4f6",
                padding: 20,
            }}
        >

            <div
                style={{
                    background: "white",
                    padding: 32,
                    borderRadius: 16,
                    width: 360,
                    boxShadow:
                        "0 4px 20px rgba(0,0,0,0.08)",
                }}
            >

                <h1
                    style={{
                        fontSize: 24,
                        fontWeight: 700,
                        marginBottom: 20,
                        textAlign: "center",
                    }}
                >
                    Intranet Admin
                </h1>

                <input
                    type="email"
                    placeholder="Correo"
                    value={correo}
                    onChange={(e) =>
                        setCorreo(
                            e.target.value
                        )
                    }
                    onKeyDown={
                        handleKeyDown
                    }
                    style={input}
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) =>
                        setPassword(
                            e.target.value
                        )
                    }
                    onKeyDown={
                        handleKeyDown
                    }
                    style={input}
                />

                {error && (

                    <p
                        style={{
                            color: "#dc2626",
                            fontSize: 13,
                            marginBottom: 14,
                        }}
                    >
                        {error}
                    </p>
                )}

                <button
                    onClick={login}
                    style={{
                        ...button,

                        opacity:
                            loading
                                ? 0.7
                                : 1,
                    }}
                    disabled={loading}
                >

                    {loading
                        ? "Ingresando..."
                        : "Ingresar"}

                </button>

            </div>

        </div>
    );
}

const input: React.CSSProperties = {
    width: "100%",
    padding: 12,
    border: "1px solid #d1d5db",
    borderRadius: 8,
    marginBottom: 14,
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
};

const button: React.CSSProperties = {
    width: "100%",
    padding: 12,
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
};
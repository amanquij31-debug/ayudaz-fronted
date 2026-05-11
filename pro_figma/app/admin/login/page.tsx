"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {

    const router = useRouter();

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const login = () => {

        if (
            correo === "admin@ayudaz.com" &&
            password === "admin123"
        ) {

            localStorage.setItem("admin", "true");

            router.push("/admin/dashboard");

        } else {

            setError("Credenciales inválidas");
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#f3f4f6"
        }}>

            <div style={{
                background: "white",
                padding: 32,
                borderRadius: 16,
                width: 360
            }}>

                <h1 style={{
                    fontSize: 24,
                    fontWeight: 700,
                    marginBottom: 20
                }}>
                    Intranet Admin
                </h1>

                <input
                    placeholder="Correo"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    style={input}
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={input}
                />

                {error && (
                    <p style={{
                        color: "red",
                        fontSize: 13
                    }}>
                        {error}
                    </p>
                )}

                <button
                    onClick={login}
                    style={button}
                >
                    Ingresar
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
    marginBottom: 14
};

const button: React.CSSProperties = {
    width: "100%",
    padding: 12,
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600
};
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase";

import {
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
} from "firebase/auth";

import { api } from "@/lib/api";

export default function LoginPage() {

    const router = useRouter();

    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState("");

    // =========================
    // LOGIN GOOGLE
    // =========================
    const handleGoogle = async () => {

        setLoading("google");
        setError("");

        try {

            const result = await signInWithPopup(
                auth,
                new GoogleAuthProvider()
            );

            const firebaseUser = result.user;

            if (!firebaseUser.email) {
                throw new Error("Correo no disponible");
            }

            let usuario;

            try {

                usuario = await api.getUsuarioPorCorreo(
                    firebaseUser.email
                );

            } catch {

                usuario = await api.crearUsuario({
                    nombres:
                        firebaseUser.displayName || "Usuario",
                    correo: firebaseUser.email,
                    telefono: "",
                    direccion: "",
                });
            }

            const rol =
                usuario.roles?.[0]?.rol?.nombreRol ??
                "USUARIO";

            // Redirección
            if (rol === "ADMIN") {

                router.push("/admin");

            } else {

                router.push("/");
            }

        } catch (err) {

            console.error(err);

            setError(
                "No se pudo iniciar sesión con Google."
            );

        } finally {

            setLoading(null);
        }
    };

    // =========================
    // LOGIN FACEBOOK
    // =========================
    const handleFacebook = async () => {

        setLoading("facebook");
        setError("");

        try {

            const result = await signInWithPopup(
                auth,
                new FacebookAuthProvider()
            );

            const firebaseUser = result.user;

            if (!firebaseUser.email) {
                throw new Error("Correo no disponible");
            }

            let usuario;

            try {

                usuario = await api.getUsuarioPorCorreo(
                    firebaseUser.email
                );

            } catch {

                usuario = await api.crearUsuario({
                    nombres:
                        firebaseUser.displayName || "Usuario",
                    correo: firebaseUser.email,
                    telefono: "",
                    direccion: "",
                });
            }

            const rol =
                usuario.roles?.[0]?.rol?.nombreRol ??
                "USUARIO";

            if (rol === "ADMIN") {

                router.push("/admin");

            } else {

                router.push("/");
            }

        } catch (err) {

            console.error(err);

            setError(
                "No se pudo iniciar sesión con Facebook."
            );

        } finally {

            setLoading(null);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "var(--bg)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
            }}
        >
            <div
                className="animate-fadeUp"
                style={{
                    background: "var(--surface)",
                    borderRadius: 20,
                    boxShadow: "var(--shadow-lg)",
                    padding: "40px 36px",
                    width: "100%",
                    maxWidth: 420,
                }}
            >

                {/* LOGO */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginBottom: 32,
                    }}
                >
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            background: "#0f1117",
                            borderRadius: 16,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 16,
                        }}
                    >
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M12 21C12 21 3 14 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14 14 21 12 21Z"
                                fill="white"
                            />
                        </svg>
                    </div>

                    <h1
                        style={{
                            fontSize: 24,
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            marginBottom: 4,
                        }}
                    >
                        Ayuda Z
                    </h1>

                    <p
                        style={{
                            fontSize: 14,
                            color: "var(--text-secondary)",
                            textAlign: "center",
                        }}
                    >
                        Red de apoyo comunitario y solidaridad
                    </p>
                </div>

                {/* BOTONES */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                    }}
                >

                    {/* GOOGLE */}
                    <button
                        onClick={handleGoogle}
                        disabled={!!loading}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                            padding: "13px 20px",
                            border: "1.5px solid var(--border)",
                            borderRadius: "var(--radius-sm)",
                            background: "white",
                            fontSize: 15,
                            fontWeight: 500,
                            color: "#111827",
                            cursor: "pointer",
                            transition: "all 0.15s",
                            opacity:
                                loading === "google"
                                    ? 0.7
                                    : 1,
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>

                        {loading === "google"
                            ? "Cargando..."
                            : "Continuar con Google"}
                    </button>

                    {/* FACEBOOK */}
                    <button
                        onClick={handleFacebook}
                        disabled={!!loading}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                            padding: "13px 20px",
                            border: "none",
                            borderRadius: "var(--radius-sm)",
                            background: "#1877f2",
                            fontSize: 15,
                            fontWeight: 600,
                            color: "white",
                            cursor: "pointer",
                            transition: "all 0.15s",
                            opacity:
                                loading === "facebook"
                                    ? 0.7
                                    : 1,
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>

                        {loading === "facebook"
                            ? "Cargando..."
                            : "Continuar con Facebook"}
                    </button>

                    {/* ERROR */}
                    {error && (
                        <p
                            style={{
                                color: "#dc2626",
                                fontSize: 13,
                                textAlign: "center",
                            }}
                        >
                            {error}
                        </p>
                    )}
                </div>

                {/* ADMIN */}
                <div
                    style={{
                        marginTop: 24,
                        paddingTop: 20,
                        borderTop: "1px solid var(--border)",
                        textAlign: "center",
                    }}
                >
                    <button
                        onClick={() => router.push("/admin/login")}
                        style={{
                            background: "none",
                            border: "none",
                            color: "var(--text-secondary)",
                            fontSize: 13,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
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
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                        </svg>

                        Acceso administrador
                    </button>
                </div>
            </div>

            <p
                style={{
                    marginTop: 20,
                    fontSize: 12,
                    color: "var(--text-muted)",
                    textAlign: "center",
                }}
            >
                Al continuar, aceptas nuestros términos y políticas.
            </p>
        </div>
    );
}
"use client";

import {
    useEffect,
    useState,
} from "react";

import { api } from "@/lib/api";

interface Usuario {
    idUsuario: number;
    nombres: string;
    correo: string;

    roles: {
        id: number;
        rol: {
            idRol: number;
            nombreRol: string;
        };
    }[];

    voluntario?: {
        idVoluntario: number;
        disponibilidad: string | null;
        zonaApoyo: string | null;
    } | null;
}

export default function UsuariosAdminPage() {

    const [usuarios, setUsuarios] =
        useState<Usuario[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    // =========================
    // CARGAR USUARIOS
    // =========================

    const cargar = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await api.obtenerUsuarios();

            console.log(data);
            
            setUsuarios(data);

        } catch (err) {

            console.error(err);

            setError(
                "Error al cargar usuarios"
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        cargar();

    }, []);

    // =========================
    // ELIMINAR
    // =========================

    const eliminar = async (
        id: number
    ) => {

        const ok = confirm(
            "¿Eliminar usuario?"
        );

        if (!ok) return;

        try {

            await api.eliminarUsuario(id);

            await cargar();

        } catch (err) {

            console.error(err);

            alert(
                "Error al eliminar"
            );
        }
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (
            <div style={{ padding: 32 }}>
                Cargando...
            </div>
        );
    }

    // =========================
    // ERROR
    // =========================

    if (error) {

        return (
            <div style={{ padding: 32 }}>
                {error}
            </div>
        );
    }

    return (

        <div style={{ padding: 32 }}>

            <h1
                style={{
                    fontSize: 28,
                    fontWeight: 800,
                    marginBottom: 24,
                }}
            >
                Usuarios
            </h1>

            <table
                style={{
                    width: "100%",
                    borderCollapse:
                        "collapse",
                }}
            >

                <thead>

                    <tr>

                        <th style={th}>
                            ID
                        </th>

                        <th style={th}>
                            Nombre
                        </th>

                        <th style={th}>
                            Correo
                        </th>

                        <th style={th}>
                            Rol
                        </th>

                        <th style={th}>
                            Voluntario
                        </th>

                        <th style={th}>
                            Acciones
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {usuarios.length === 0 ? (

                        <tr>

                            <td
                                colSpan={6}
                                style={{
                                    padding: 20,
                                    textAlign: "center",
                                }}
                            >
                                No hay usuarios
                            </td>

                        </tr>

                    ) : (

                        usuarios.map((u) => (

                            <tr
                                key={u.idUsuario}
                            >

                                <td style={td}>
                                    {u.idUsuario}
                                </td>

                                <td style={td}>
                                    {u.nombres}
                                </td>

                                <td style={td}>
                                    {u.correo}
                                </td>

                                <td style={td}>
                                    {u.roles?.length > 0
                                        ? u.roles
                                            .map(
                                                (r) =>
                                                    r.rol.nombreRol
                                            )
                                            .join(", ")
                                        : "Sin rol"}
                                </td>

                                <td style={td}>
                                    {u.voluntario
                                        ? "Sí"
                                        : "No"}
                                </td>

                                <td style={td}>

                                    <button
                                        onClick={() =>
                                            eliminar(
                                                u.idUsuario
                                            )
                                        }
                                        style={
                                            eliminarBtn
                                        }
                                    >
                                        Eliminar
                                    </button>

                                </td>

                            </tr>
                        ))
                    )}

                </tbody>

            </table>

        </div>
    );
}

const th: React.CSSProperties = {
    textAlign: "left",
    padding: 12,
    borderBottom:
        "1px solid #e5e7eb",
};

const td: React.CSSProperties = {
    padding: 12,
    borderBottom:
        "1px solid #f3f4f6",
};

const eliminarBtn:
    React.CSSProperties = {

    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: "pointer",
};
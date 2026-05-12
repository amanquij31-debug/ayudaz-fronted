"use client";

import {
    useEffect,
    useState,
} from "react";

import { api } from "@/lib/api";

export default function SolicitudesAdminPage() {

    const [solicitudes,
        setSolicitudes] =
        useState<any[]>([]);

    const [loading, setLoading] =
        useState(true);

    const cargar = async () => {

        try {

            const data =
                await api.obtenerSolicitudes();

            console.log(
                "SOLICITUDES:",
                data
            );

            setSolicitudes(data);

        } catch (error) {

            console.error(error);

            alert(
                "Error al cargar solicitudes"
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
            "¿Eliminar solicitud?"
        );

        if (!ok) return;

        try {

            await api.eliminarSolicitud(
                id
            );

            cargar();

        } catch (error) {

            console.error(error);

            alert(
                "Error al eliminar solicitud"
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

    return (

        <div style={{ padding: 32 }}>

            <h1
                style={{
                    fontSize: 28,
                    fontWeight: 800,
                    marginBottom: 24,
                }}
            >
                Solicitudes
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
                            Título
                        </th>

                        <th style={th}>
                            Usuario
                        </th>

                        <th style={th}>
                            Estado
                        </th>

                        <th style={th}>
                            Acciones
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {solicitudes.map((s) => (

                        <tr
                            key={s.idSolicitud}
                        >

                            <td style={td}>
                                {s.idSolicitud}
                            </td>

                            <td style={td}>
                                {s.titulo}
                            </td>

                            <td style={td}>
                                {
                                    s.usuario
                                        ?.nombres ||
                                    "Sin usuario"
                                }
                            </td>

                            <td style={td}>
                                {
                                    s.estado
                                        ?.nombreEstado ||
                                    "Sin estado"
                                }
                            </td>

                            <td style={td}>

                                <button
                                    onClick={() =>
                                        eliminar(
                                            s.idSolicitud
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
                    ))}

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
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function SolicitudesAdminPage() {

    const [solicitudes, setSolicitudes] = useState<any[]>([]);

    useEffect(() => {

        cargar();

    }, []);

    const cargar = async () => {

        const data = await api.obtenerSolicitudes();

        setSolicitudes(data);
    };

    return (
        <div style={{ padding: 32 }}>

            <h1 style={{
                fontSize: 28,
                fontWeight: 800,
                marginBottom: 24
            }}>
                Solicitudes
            </h1>

            <table style={{
                width: "100%",
                borderCollapse: "collapse"
            }}>

                <thead>
                    <tr>
                        <th style={th}>Título</th>
                        <th style={th}>Usuario</th>
                        <th style={th}>Estado</th>
                    </tr>
                </thead>

                <tbody>

                    {solicitudes.map((s) => (

                        <tr key={s.idSolicitud}>

                            <td style={td}>{s.titulo}</td>

                            <td style={td}>
                                {s.usuario?.nombres}
                            </td>

                            <td style={td}>
                                {s.estado?.nombreEstado}
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
    borderBottom: "1px solid #e5e7eb"
};

const td: React.CSSProperties = {
    padding: 12,
    borderBottom: "1px solid #f3f4f6"
};
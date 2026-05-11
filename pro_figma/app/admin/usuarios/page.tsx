"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function UsuariosAdminPage() {

    const [usuarios, setUsuarios] = useState<any[]>([]);

    useEffect(() => {

        cargar();

    }, []);

    const cargar = async () => {

        const data = await api.obtenerUsuarios();

        setUsuarios(data);
    };

    return (
        <div style={{ padding: 32 }}>

            <h1 style={{
                fontSize: 28,
                fontWeight: 800,
                marginBottom: 24
            }}>
                Usuarios
            </h1>

            <table style={{
                width: "100%",
                borderCollapse: "collapse"
            }}>

                <thead>
                    <tr>
                        <th style={th}>Nombre</th>
                        <th style={th}>Correo</th>
                        <th style={th}>Rol</th>
                    </tr>
                </thead>

                <tbody>

                    {usuarios.map((u) => (

                        <tr key={u.idUsuario}>

                            <td style={td}>{u.nombres}</td>

                            <td style={td}>{u.correo}</td>

                            <td style={td}>
                                {u.roles?.[0]?.rol?.nombreRol}
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
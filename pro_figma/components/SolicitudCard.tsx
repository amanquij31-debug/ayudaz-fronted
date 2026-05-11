"use client";
import { useAuth } from "@/lib/AuthContext";

export interface Solicitud {
    id: string;
    titulo: string;
    categoria: string;
    descripcion: string;
    ubicacion: string;
    estado: "abierta" | "en-progreso" | "completada";
    autorNombre: string;
    autorIniciales: string;
    fecha: string;
    voluntariosActuales: number;
    voluntariosNecesarios: number;
}

const CATEGORIA_COLORS: Record<string, string> = {
    Transporte: "#dbeafe",
    Alimentos: "#fef3c7",
    Educación: "#ede9fe",
    Salud: "#fee2e2",
    Hogar: "#d1fae5",
    "Cuidado de Niños": "#fce7f3",
    Otro: "#f3f4f6",
};

const CATEGORIA_TEXT: Record<string, string> = {
    Transporte: "#1d4ed8",
    Alimentos: "#92400e",
    Educación: "#5b21b6",
    Salud: "#991b1b",
    Hogar: "#065f46",
    "Cuidado de Niños": "#9d174d",
    Otro: "#374151",
};

const ESTADO_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
    abierta: { label: "Abierta", color: "#f59e0b", dot: "#f59e0b" },
    "en-progreso": { label: "En Progreso", color: "#3b82f6", dot: "#3b82f6" },
    completada: { label: "Completada", color: "#10b981", dot: "#10b981" },
};

const normalizeEstado = (estado: string) =>
    (estado || "").toLowerCase().replace(/\s+/g, "-");

interface Props {
    solicitud: Solicitud;
    onOfrecer: (s: Solicitud) => void;
}

export default function SolicitudCard({ solicitud, onOfrecer }: Props) {
    const { user } = useAuth();

    const isGuest = !user;

    // 🔥 FIX IMPORTANTE: normalizar rol seguro
    const role = user?.rol?.toLowerCase() ?? "";

    // 🔥 SOLO VOLUNTARIO Y ADMIN PUEDEN AYUDAR
    const puedeAyudar =
        role === "voluntario" || role === "admin";

    const estadoKey = normalizeEstado(solicitud.estado);

    const estado =
        ESTADO_CONFIG[estadoKey] ?? {
            label: "Desconocido",
            color: "#9ca3af",
            dot: "#9ca3af",
        };

    const catBg = CATEGORIA_COLORS[solicitud.categoria] ?? "#f3f4f6";
    const catText = CATEGORIA_TEXT[solicitud.categoria] ?? "#374151";

    return (
        <div
            className="animate-fadeUp"
            style={{
                background: "var(--surface)",
                border: "1.5px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                transition: "box-shadow 0.2s",
            }}
        >
            {/* TAGS */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span
                    style={{
                        padding: "3px 10px",
                        borderRadius: "var(--radius-full)",
                        fontSize: 12,
                        fontWeight: 500,
                        background: catBg,
                        color: catText,
                    }}
                >
                    {solicitud.categoria}
                </span>

                <span
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "3px 10px",
                        borderRadius: "var(--radius-full)",
                        fontSize: 12,
                        fontWeight: 500,
                        border: "1.5px solid var(--border)",
                        color: "var(--text-secondary)",
                    }}
                >
                    <span
                        style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: estado.dot,
                            display: "inline-block",
                        }}
                    />
                    {estado.label}
                </span>
            </div>

            {/* TITULO */}
            <h3 style={{ fontSize: 17, fontWeight: 700 }}>
                {solicitud.titulo}
            </h3>

            {/* AUTOR */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                    style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "#e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 600,
                    }}
                >
                    {solicitud.autorIniciales}
                </div>
                <span style={{ fontSize: 13 }}>
                    {solicitud.autorNombre}
                </span>
            </div>

            {/* DESCRIPCION */}
            <p
                style={{
                    fontSize: 14,
                    color: "var(--text-secondary)",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                }}
            >
                {solicitud.descripcion}
            </p>

            {/* META */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <MetaRow icon="pin">{solicitud.ubicacion}</MetaRow>
                <MetaRow icon="calendar">{solicitud.fecha}</MetaRow>
                <MetaRow icon="users">
                    {solicitud.voluntariosActuales} de{" "}
                    {solicitud.voluntariosNecesarios}
                </MetaRow>
            </div>

            {/* BOTON (REGLA FINAL CORRECTA) */}
            {solicitud.estado !== "completada" && (
                <button
                    onClick={() => {
    if (!user) return;
    if (!puedeAyudar) return;

    return onOfrecer(solicitud);
}}
                    disabled={!puedeAyudar}
                    style={{
                        width: "100%",
                        padding: "12px",
                        background: !puedeAyudar
                            ? "#e5e7eb"
                            : "var(--text-primary)",
                        color: !puedeAyudar
                            ? "var(--text-muted)"
                            : "white",
                        border: "none",
                        borderRadius: "var(--radius-sm)",
                        fontSize: 15,
                        fontWeight: 600,
                        cursor: !puedeAyudar
                            ? "not-allowed"
                            : "pointer",
                        opacity: !puedeAyudar ? 0.7 : 1,
                        marginTop: 4,
                    }}
                >
                    {!puedeAyudar
                        ? "Solo puedes revisar solicitudes"
                        : "Ofrecer Ayuda"}
                </button>
            )}
        </div>
    );
}

/* META ROW */
function MetaRow({
    icon,
    children,
}: {
    icon: string;
    children: React.ReactNode;
}) {
    const icons: Record<string, React.ReactNode> = {
        pin: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13z" />
            </svg>
        ),
        calendar: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="4" width="18" height="18" rx="2" />
            </svg>
        ),
        users: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="9" cy="7" r="4" />
            </svg>
        ),
    };

    return (
        <div style={{ display: "flex", gap: 6, fontSize: 13 }}>
            {icons[icon]}
            {children}
        </div>
    );
}
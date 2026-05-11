"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/lib/AuthContext";
import { api } from "@/lib/api";

type Paso = "elegir_rol" | "formulario_ayudante" | "formulario_ayudado" | "completado";

const ZONAS = ["SJL - Centro", "SJL - Zárate", "SJL - Canto Grande", "SJL - Las Flores", "SJL - Campoy", "SJL - Otro"];
const HABILIDADES = ["Conducción", "Enfermería", "Carpintería", "Electricidad", "Cocina", "Enseñanza", "Plomería", "Cuidado de niños"];
const SITUACIONES = ["Desempleado/a", "Empleo informal", "Empleo part-time", "Jubilado/a", "Otro"];
const INGRESOS = ["Menos de S/. 500", "S/. 500 - S/. 1,000", "S/. 1,000 - S/. 1,500"];

interface FormAyudante {
    nombres: string;
    edad: number;
    telefono: string;
    zonaApoyo: string;
    habilidades: string[];
    declaracion: boolean;
}

interface FormAyudado {
    nombres: string;
    dni: string;
    edad: number;
    telefono: string;
    direccion: string;
    situacionEconomica: string;
    ingresoFamiliar: string;
    personasHogar: number;
    declaracion: boolean;
}

export default function RegistroPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [paso, setPaso] = useState<Paso>("elegir_rol");
    const [rol, setRol] = useState<"ayudante" | "ayudado" | null>(null);
    const [loading, setLoading] = useState(false);
    const [habilidadesSeleccionadas, setHabilidadesSeleccionadas] = useState<string[]>([]);

    const formAyudante = useForm<FormAyudante>({ defaultValues: { nombres: user?.displayName ?? "", edad: 18 } });
    const formAyudado = useForm<FormAyudado>({ defaultValues: { nombres: user?.displayName ?? "", personasHogar: 1 } });

    const elegirRol = (r: "ayudante" | "ayudado") => {
        setRol(r);
        setPaso(r === "ayudante" ? "formulario_ayudante" : "formulario_ayudado");
    };

    const toggleHabilidad = (h: string) => {
        setHabilidadesSeleccionadas(prev =>
            prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]
        );
    };

    const submitAyudante = async (data: FormAyudante) => {
        if (data.edad < 18) {
            formAyudante.setError("edad", { message: "Debes ser mayor de 18 años" });
            return;
        }
        if (habilidadesSeleccionadas.length === 0) {
            alert("Selecciona al menos una habilidad");
            return;
        }
        setLoading(true);
        try {
            await api.crearUsuario({
                nombres: data.nombres,
                correo: user?.email,
                telefono: data.telefono,
                rol: "VOLUNTARIO",
                zonaApoyo: data.zonaApoyo,
                habilidades: habilidadesSeleccionadas,
            });
            setPaso("completado");
        } catch (e) {
            alert("Error al guardar. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const submitAyudado = async (data: FormAyudado) => {
        if (data.edad < 18) {
            formAyudado.setError("edad", { message: "Debes ser mayor de 18 años" });
            return;
        }
        if (data.dni.length !== 8) {
            formAyudado.setError("dni", { message: "El DNI debe tener 8 dígitos" });
            return;
        }
        setLoading(true);
        try {
            await api.crearUsuario({
                nombres: data.nombres,
                correo: user?.email,
                telefono: data.telefono,
                direccion: data.direccion,
                dni: data.dni,
                rol: "USUARIO",
                situacionEconomica: data.situacionEconomica,
                ingresoFamiliar: data.ingresoFamiliar,
                personasHogar: data.personasHogar,
            });
            setPaso("completado");
        } catch (e) {
            alert("Error al guardar. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh", background: "var(--bg)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
        }}>
            {/* PASO 1: Elegir rol */}
            {paso === "elegir_rol" && (
                <div className="animate-fadeUp" style={{ width: "100%", maxWidth: 560 }}>
                    <div style={{ textAlign: "center", marginBottom: 32 }}>
                        <div style={{
                            width: 56, height: 56, background: "#0f1117", borderRadius: 14,
                            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
                        }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                                <path d="M12 21C12 21 3 14 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14 14 21 12 21Z" />
                            </svg>
                        </div>
                        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Bienvenido/a a Ayuda Z</h1>
                        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
                            Hola <strong>{user?.displayName ?? user?.email}</strong>, ¿cómo quieres participar?
                        </p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        {/* Ayudante */}
                        <button onClick={() => elegirRol("ayudante")} style={{
                            background: "var(--surface)", border: "2px solid var(--border)",
                            borderRadius: 16, padding: 28, cursor: "pointer", textAlign: "left",
                            transition: "all 0.2s",
                        }}
                            onMouseEnter={e => {
                                e.currentTarget.style.border = "2px solid #0f1117";
                                e.currentTarget.style.boxShadow = "var(--shadow-md)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.border = "2px solid var(--border)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            <div style={{
                                width: 48, height: 48, background: "#d1fae5", borderRadius: 12,
                                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth="2">
                                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                                </svg>
                            </div>
                            <p style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Quiero ayudar</p>
                            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                Seré voluntario y apoyaré a personas que necesiten ayuda en mi comunidad.
                            </p>
                            <div style={{
                                marginTop: 16, display: "inline-flex", alignItems: "center", gap: 6,
                                fontSize: 12, fontWeight: 600, color: "#065f46",
                                background: "#d1fae5", padding: "4px 10px", borderRadius: 99,
                            }}>
                                ✓ Acceso inmediato
                            </div>
                        </button>

                        {/* Ayudado */}
                        <button onClick={() => elegirRol("ayudado")} style={{
                            background: "var(--surface)", border: "2px solid var(--border)",
                            borderRadius: 16, padding: 28, cursor: "pointer", textAlign: "left",
                            transition: "all 0.2s",
                        }}
                            onMouseEnter={e => {
                                e.currentTarget.style.border = "2px solid #0f1117";
                                e.currentTarget.style.boxShadow = "var(--shadow-md)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.border = "2px solid var(--border)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            <div style={{
                                width: 48, height: 48, background: "#dbeafe", borderRadius: 12,
                                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
                                    <path d="M12 21C12 21 3 14 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14 14 21 12 21Z" />
                                </svg>
                            </div>
                            <p style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Necesito ayuda</p>
                            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                Soy una persona en situación de vulnerabilidad y requiero apoyo de la comunidad.
                            </p>
                            <div style={{
                                marginTop: 16, display: "inline-flex", alignItems: "center", gap: 6,
                                fontSize: 12, fontWeight: 600, color: "#1d4ed8",
                                background: "#dbeafe", padding: "4px 10px", borderRadius: 99,
                            }}>
                                ✓ Requiere verificación
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {/* PASO 2A: Formulario Ayudante */}
            {paso === "formulario_ayudante" && (
                <div className="animate-slideIn" style={{
                    background: "var(--surface)", borderRadius: 20,
                    boxShadow: "var(--shadow-lg)", padding: 36,
                    width: "100%", maxWidth: 520,
                }}>
                    <button onClick={() => setPaso("elegir_rol")} style={{
                        background: "none", border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 6,
                        fontSize: 13, color: "var(--text-secondary)", marginBottom: 20,
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 5l-7 7 7 7" />
                        </svg>
                        Volver
                    </button>

                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                        <div style={{ width: 40, height: 40, background: "#d1fae5", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                            </svg>
                        </div>
                        <div>
                            <h2 style={{ fontSize: 20, fontWeight: 700 }}>Datos del voluntario</h2>
                            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Completa tu perfil para comenzar a ayudar</p>
                        </div>
                    </div>

                    <form onSubmit={formAyudante.handleSubmit(submitAyudante)} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <Campo label="Nombre completo" error={formAyudante.formState.errors.nombres?.message}>
                            <input placeholder="Tu nombre completo"
                                {...formAyudante.register("nombres", { required: "Requerido" })}
                                style={inputStyle} />
                        </Campo>

                        <Campo label="Edad" error={formAyudante.formState.errors.edad?.message}>
                            <input type="number" min={18} max={99}
                                {...formAyudante.register("edad", { required: "Requerido", min: { value: 18, message: "Debes ser mayor de 18 años" } })}
                                style={inputStyle} />
                        </Campo>

                        <Campo label="Teléfono" error={formAyudante.formState.errors.telefono?.message}>
                            <input placeholder="9XXXXXXXX"
                                {...formAyudante.register("telefono", { required: "Requerido", minLength: { value: 9, message: "Teléfono inválido" } })}
                                style={inputStyle} />
                        </Campo>

                        <Campo label="Zona de apoyo">
                            <select {...formAyudante.register("zonaApoyo", { required: true })} style={selectStyle}>
                                <option value="">Selecciona tu zona</option>
                                {ZONAS.map(z => <option key={z} value={z}>{z}</option>)}
                            </select>
                        </Campo>

                        <Campo label="Habilidades (selecciona las que tengas)">
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                {HABILIDADES.map(h => (
                                    <button type="button" key={h} onClick={() => toggleHabilidad(h)} style={{
                                        padding: "6px 14px", borderRadius: 99, fontSize: 13, cursor: "pointer",
                                        border: "1.5px solid " + (habilidadesSeleccionadas.includes(h) ? "#0f1117" : "var(--border)"),
                                        background: habilidadesSeleccionadas.includes(h) ? "#0f1117" : "transparent",
                                        color: habilidadesSeleccionadas.includes(h) ? "white" : "var(--text-secondary)",
                                        transition: "all 0.15s",
                                    }}>{h}</button>
                                ))}
                            </div>
                        </Campo>

                        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", marginTop: 4 }}>
                            <input type="checkbox"
                                {...formAyudante.register("declaracion", { required: "Debes aceptar" })}
                                style={{ marginTop: 3, flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                Declaro que la información proporcionada es verdadera y que soy mayor de 18 años.
                            </span>
                        </label>
                        {formAyudante.formState.errors.declaracion && (
                            <p style={{ fontSize: 12, color: "var(--accent-red)" }}>
                                {formAyudante.formState.errors.declaracion.message}
                            </p>
                        )}

                        <button type="submit" disabled={loading} style={{
                            marginTop: 8, padding: "13px",
                            background: loading ? "#9ca3af" : "#0f1117",
                            border: "none", borderRadius: 10,
                            fontSize: 15, fontWeight: 600, color: "white",
                            cursor: loading ? "not-allowed" : "pointer",
                        }}>
                            {loading ? "Guardando..." : "Registrarme como voluntario"}
                        </button>
                    </form>
                </div>
            )}

            {/* PASO 2B: Formulario Ayudado */}
            {paso === "formulario_ayudado" && (
                <div className="animate-slideIn" style={{
                    background: "var(--surface)", borderRadius: 20,
                    boxShadow: "var(--shadow-lg)", padding: 36,
                    width: "100%", maxWidth: 520,
                    maxHeight: "90vh", overflowY: "auto",
                }}>
                    <button onClick={() => setPaso("elegir_rol")} style={{
                        background: "none", border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 6,
                        fontSize: 13, color: "var(--text-secondary)", marginBottom: 20,
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 5l-7 7 7 7" />
                        </svg>
                        Volver
                    </button>

                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                        <div style={{ width: 40, height: 40, background: "#dbeafe", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2">
                                <path d="M12 21C12 21 3 14 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14 14 21 12 21Z" />
                            </svg>
                        </div>
                        <div>
                            <h2 style={{ fontSize: 20, fontWeight: 700 }}>Solicitar apoyo</h2>
                            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>Completa tus datos para acceder al sistema</p>
                        </div>
                    </div>

                    {/* Aviso SISFOH */}
                    <div style={{
                        background: "#fffbeb", border: "1.5px solid #fde68a",
                        borderRadius: 10, padding: "12px 16px", marginBottom: 20,
                        display: "flex", gap: 10, alignItems: "flex-start",
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#d97706" style={{ flexShrink: 0, marginTop: 1 }}>
                            <path d="M12 2L1 21h22L12 2zm1 14h-2v-2h2v2zm0-4h-2V8h2v4z" />
                        </svg>
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#92400e" }}>Verificación de elegibilidad</p>
                            <p style={{ fontSize: 12, color: "#92400e", marginTop: 2, lineHeight: 1.5 }}>
                                Este sistema es exclusivo para personas en situación de vulnerabilidad económica del distrito de San Juan de Lurigancho.
                                Tu solicitud será revisada por un administrador antes de ser aprobada.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={formAyudado.handleSubmit(submitAyudado)} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <Campo label="Nombre completo" error={formAyudado.formState.errors.nombres?.message}>
                            <input placeholder="Tu nombre completo"
                                {...formAyudado.register("nombres", { required: "Requerido" })}
                                style={inputStyle} />
                        </Campo>

                        <Campo label="DNI" error={formAyudado.formState.errors.dni?.message}>
                            <input placeholder="12345678" maxLength={8}
                                {...formAyudado.register("dni", {
                                    required: "Requerido",
                                    minLength: { value: 8, message: "El DNI debe tener 8 dígitos" },
                                    maxLength: { value: 8, message: "El DNI debe tener 8 dígitos" },
                                    pattern: { value: /^[0-9]+$/, message: "Solo números" },
                                })}
                                style={inputStyle} />
                        </Campo>

                        <Campo label="Edad" error={formAyudado.formState.errors.edad?.message}>
                            <input type="number" min={18} max={99}
                                {...formAyudado.register("edad", {
                                    required: "Requerido",
                                    min: { value: 18, message: "Debes ser mayor de 18 años" },
                                })}
                                style={inputStyle} />
                        </Campo>

                        <Campo label="Teléfono" error={formAyudado.formState.errors.telefono?.message}>
                            <input placeholder="9XXXXXXXX"
                                {...formAyudado.register("telefono", { required: "Requerido" })}
                                style={inputStyle} />
                        </Campo>

                        <Campo label="Dirección" error={formAyudado.formState.errors.direccion?.message}>
                            <input placeholder="Barrio o zona en San Juan de Lurigancho"
                                {...formAyudado.register("direccion", { required: "Requerido" })}
                                style={inputStyle} />
                        </Campo>

                        <Campo label="Situación laboral actual" error={formAyudado.formState.errors.situacionEconomica?.message}>
                            <select {...formAyudado.register("situacionEconomica", { required: "Requerido" })} style={selectStyle}>
                                <option value="">Selecciona tu situación</option>
                                {SITUACIONES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </Campo>

                        <Campo label="Ingreso familiar mensual" error={formAyudado.formState.errors.ingresoFamiliar?.message}>
                            <select {...formAyudado.register("ingresoFamiliar", { required: "Requerido" })} style={selectStyle}>
                                <option value="">Selecciona el rango</option>
                                {INGRESOS.map(i => <option key={i} value={i}>{i}</option>)}
                            </select>
                        </Campo>

                        <Campo label="N° de personas en tu hogar">
                            <input type="number" min={1} max={20}
                                {...formAyudado.register("personasHogar", { required: true })}
                                style={inputStyle} />
                        </Campo>

                        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
                            <input type="checkbox"
                                {...formAyudado.register("declaracion", { required: "Debes aceptar la declaración" })}
                                style={{ marginTop: 3, flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                Declaro bajo juramento que la información proporcionada es verdadera y que me encuentro en situación de vulnerabilidad económica.
                            </span>
                        </label>
                        {formAyudado.formState.errors.declaracion && (
                            <p style={{ fontSize: 12, color: "var(--accent-red)" }}>
                                {formAyudado.formState.errors.declaracion.message}
                            </p>
                        )}

                        <button type="submit" disabled={loading} style={{
                            marginTop: 8, padding: "13px",
                            background: loading ? "#9ca3af" : "#0f1117",
                            border: "none", borderRadius: 10,
                            fontSize: 15, fontWeight: 600, color: "white",
                            cursor: loading ? "not-allowed" : "pointer",
                        }}>
                            {loading ? "Guardando..." : "Enviar solicitud de registro"}
                        </button>
                    </form>
                </div>
            )}

            {/* PASO 3: Completado */}
            {paso === "completado" && (
                <div className="animate-fadeUp" style={{
                    background: "var(--surface)", borderRadius: 20,
                    boxShadow: "var(--shadow-lg)", padding: 48,
                    width: "100%", maxWidth: 440, textAlign: "center",
                }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: "50%",
                        background: rol === "ayudante" ? "#d1fae5" : "#dbeafe",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 20px",
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                            stroke={rol === "ayudante" ? "#065f46" : "#1d4ed8"} strokeWidth="2.5">
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                    </div>

                    <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>
                        {rol === "ayudante" ? "¡Ya eres voluntario!" : "¡Registro enviado!"}
                    </h2>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 28 }}>
                        {rol === "ayudante"
                            ? "Tu perfil está listo. Ya puedes ver las solicitudes y ofrecer ayuda a quien lo necesite."
                            : "Tu solicitud de registro fue enviada. Un administrador revisará tus datos y te notificará pronto."
                        }
                    </p>

                    <button onClick={() => router.push("/")} style={{
                        width: "100%", padding: "13px",
                        background: "#0f1117", border: "none", borderRadius: 10,
                        fontSize: 15, fontWeight: 600, color: "white", cursor: "pointer",
                    }}>
                        Ir al dashboard
                    </button>
                </div>
            )}
        </div>
    );
}

// Componentes auxiliares
function Campo({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>{label}</label>
            {children}
            {error && <p style={{ fontSize: 12, color: "var(--accent-red)" }}>{error}</p>}
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px",
    border: "1.5px solid var(--border)", borderRadius: 8,
    fontSize: 14, color: "var(--text-primary)", background: "#f9fafb",
    outline: "none", fontFamily: "inherit",
};

const selectStyle: React.CSSProperties = {
    ...inputStyle, cursor: "pointer", appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
};
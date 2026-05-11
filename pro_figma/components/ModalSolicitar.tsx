"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/lib/AuthContext";

const CATEGORIAS = ["Alimentos", "Transporte", "Cuidado de Niños", "Educación", "Salud", "Hogar", "Otro"];
const INGRESOS = ["Menos de S/. 500", "S/. 500 - S/. 1,000", "S/. 1,000 - S/. 1,500"];
const SITUACIONES = ["Desempleado/a", "Empleo informal", "Empleo part-time", "Otro"];

const URGENCIAS = [
    { id: 1, nombre: "Baja" },
    { id: 2, nombre: "Media" },
    { id: 3, nombre: "Alta" },
    { id: 4, nombre: "Crítica" },
];

interface FormData {
    ingresoFamiliar: string;
    situacionLaboral: string;
    personasHogar: number;
    declaracion: boolean;

    titulo: string;
    categoria: string;
    descripcion: string;

    ubicacion: string;
    voluntariosNecesarios: number;
    infoAdicional: string;

    id_urgencia: number;
}

interface Props {
    onClose: () => void;
    onSubmit: (data: FormData) => Promise<void>;
}

export default function ModalSolicitar({ onClose, onSubmit }: Props) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            personasHogar: 1,
            voluntariosNecesarios: 1,
            id_urgencia: 2,
        },
    });

    const onFormSubmit = async (data: FormData) => {
        setLoading(true);

        await onSubmit({
            ...data,
            id_urgencia: Number(data.id_urgencia),
        });

        setLoading(false);
        onClose();
    };

    return (
        <div className="animate-fadeIn" style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16,
        }} onClick={e => e.target === e.currentTarget && onClose()}>

            <div className="animate-slideIn" style={{
                background: "var(--surface)",
                borderRadius: 16,
                width: "100%", maxWidth: 520,
                maxHeight: "90vh", overflowY: "auto",
                padding: 28,
            }}>

                {/* HEADER */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div>
                        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Solicitar Ayuda</h2>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
                            Este sistema está diseñado para apoyar a personas en situación de vulnerabilidad económica.
                        </p>
                    </div>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit(onFormSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>

                    {/* VERIFICACIÓN */}
                    <div style={{
                        background: "#eff6ff",
                        border: "1.5px solid #bfdbfe",
                        borderRadius: "var(--radius-sm)",
                        padding: 16,
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                    }}>

                        <div style={{ fontWeight: 600, color: "#1e40af" }}>
                            Verificación de Elegibilidad
                        </div>

                        <Field label="Nivel de urgencia" error={errors.id_urgencia?.message}>
                            <select
                                {...register("id_urgencia", {
                                    required: "Requerido",
                                    valueAsNumber: true,
                                })}
                                style={selectStyle}
                            >
                                <option value="">Selecciona nivel</option>
                                {URGENCIAS.map(u => (
                                    <option key={u.id} value={u.id}>
                                        {u.nombre}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Ingreso familiar mensual" error={errors.ingresoFamiliar?.message}>
                            <select {...register("ingresoFamiliar", { required: true })} style={selectStyle}>
                                <option value="">Selecciona</option>
                                {INGRESOS.map(i => <option key={i}>{i}</option>)}
                            </select>
                        </Field>

                        <Field label="Situación laboral" error={errors.situacionLaboral?.message}>
                            <select {...register("situacionLaboral", { required: true })} style={selectStyle}>
                                <option value="">Selecciona</option>
                                {SITUACIONES.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </Field>

                        <Field label="Personas en el hogar" error={errors.personasHogar?.message}>
                            <input type="number" min={1} {...register("personasHogar", { required: true })} style={inputStyle} />
                        </Field>

                        <label style={{ fontSize: 12 }}>
                            <input type="checkbox" {...register("declaracion", { required: true })} /> Declaro que la información es verdadera
                        </label>
                    </div>

                    {/* DATOS PRINCIPALES */}
                    <Field label="Título" error={errors.titulo?.message}>
                        <input {...register("titulo", { required: true })} style={inputStyle} />
                    </Field>

                    <Field label="Categoría" error={errors.categoria?.message}>
                        <select {...register("categoria", { required: true })} style={selectStyle}>
                            <option value="">Selecciona</option>
                            {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </Field>

                    <Field label="Descripción" error={errors.descripcion?.message}>
                        <textarea rows={4} {...register("descripcion", { required: true })} style={inputStyle} />
                    </Field>

                    {/* RESTAURADO: CAMPOS ORIGINALES */}
                    <Field label="Ubicación">
                        <input
                            placeholder="Ej: San Juan de Lurigancho"
                            {...register("ubicacion")}
                            style={inputStyle}
                        />
                    </Field>

                    <Field label="Voluntarios necesarios">
                        <input
                            type="number"
                            min={1}
                            {...register("voluntariosNecesarios")}
                            style={inputStyle}
                        />
                    </Field>

                    <Field label="Información adicional">
                        <textarea
                            rows={3}
                            {...register("infoAdicional")}
                            style={inputStyle}
                        />
                    </Field>

                    {/* BOTONES */}
                    <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 6 }}>

                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: "10px 18px",
                                border: "1.5px solid var(--border)",
                                borderRadius: "var(--radius-sm)",
                                background: "transparent",
                                fontSize: 14,
                                fontWeight: 500,
                                cursor: "pointer",
                            }}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: "10px 18px",
                                border: "none",
                                borderRadius: "var(--radius-sm)",
                                background: loading ? "#9ca3af" : "var(--text-primary)",
                                fontSize: 14,
                                fontWeight: 600,
                                color: "white",
                                cursor: loading ? "not-allowed" : "pointer",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                            }}
                        >
                            {loading ? "Enviando..." : "Publicar Solicitud"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}

/* FIELD */
function Field({ label, error, children }: any) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 14, fontWeight: 500 }}>{label}</label>
            {children}
            {error && <p style={{ fontSize: 12, color: "red" }}>{error}</p>}
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    fontSize: 14,
};

const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: "pointer",
};
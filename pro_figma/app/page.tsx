"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";
import SolicitudCard, { Solicitud } from "@/components/SolicitudCard";
import RankingKI, { Guerrero } from "@/components/RankingKI";
import ModalSolicitar from "@/components/ModalSolicitar";
import ModalOfrecer from "@/components/ModalOfrecer";
import { api } from "@/lib/api";

const CATEGORIAS = ["Todas", "Alimentos", "Transporte", "Cuidado de Niños", "Educación", "Salud", "Hogar", "Otro"];

export default function HomePage() {
  const { user, isGuest, loading } = useAuth();
  const router = useRouter();

  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [guerreros, setGuerreros] = useState<Guerrero[]>([]);
  const [userRol, setUserRol] = useState<string | null>(null);

  useEffect(() => {
    api.getSolicitudes().then(data => {
      // Mapea los campos del backend al formato del frontend
      const mapeadas = data.map((s: any) => ({
        id: String(s.idSolicitud),
        titulo: s.titulo,
        categoria: s.categoria?.nombreCategoria ?? "Otro",
        descripcion: s.descripcion,
        ubicacion: s.ubicacion ?? "SJL",
        estado: s.estado?.nombreEstado?.toLowerCase().replace("_", "-") ?? "abierta",
        autorNombre: s.usuario?.nombres ?? "Anónimo",
        autorIniciales: s.usuario?.nombres?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) ?? "??",
        fecha: new Date(s.fechaSolicitud).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" }),
        voluntariosActuales: 0,
        voluntariosNecesarios: 1,
      }));
      setSolicitudes(mapeadas);
    }).catch(() => setSolicitudes([]));

    api.getVoluntarios().then(data => {
      const mapeados = data.map((v: any, i: number) => ({
        uid: String(v.idVoluntario),
        nombre: v.usuario?.nombres ?? "Voluntario",
        iniciales: v.usuario?.nombres?.split(" ").map((n: string) => n[0]).join("").slice(0, 2) ?? "??",
        puntosKI: Math.max(0, 10 - i * 2),
        nivel: Math.max(1, 20 - i * 3),
        titulo: i === 0 ? "Ultra Instinto" : i === 1 ? "Super Saiyajin Blue" : "Super Saiyajin",
        color: "#dbeafe",
      }));
      setGuerreros(mapeados);
    }).catch(() => setGuerreros([]));

    // Obtener rol del usuario actual
    if (user?.email) {
      api.getUsuarioPorCorreo(user.email).then((u: any) => {
        const rol = u.roles?.[0]?.rol?.nombreRol ?? "USUARIO";
        setUserRol(rol);
      }).catch(() => setUserRol(null));
    }
  }, [user]);

  const [filtroEstado, setFiltroEstado] = useState("Todas");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [modalSolicitar, setModalSolicitar] = useState(false);
  const [modalOfrecer, setModalOfrecer] = useState<Solicitud | null>(null);

  useEffect(() => {
    if (!loading && !user && !isGuest) router.push("/login");
  }, [user, isGuest, loading, router]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 14, color: "var(--text-muted)" }}>Cargando...</div>
    </div>
  );

  const stats = {
    total: solicitudes.length,
    abiertas: solicitudes.filter(s => s.estado === "abierta").length,
    enProgreso: solicitudes.filter(s => s.estado === "en-progreso").length,
    completadas: solicitudes.filter(s => s.estado === "completada").length,
  };

  const filtradas = solicitudes.filter(s => {
    const matchEstado =
      filtroEstado === "Todas" ? true :
        filtroEstado === "Abiertas" ? s.estado === "abierta" :
          filtroEstado === "Progreso" ? s.estado === "en-progreso" :
            s.estado === "completada";
    const matchCat = filtroCategoria === "Todas" || s.categoria === filtroCategoria;
    return matchEstado && matchCat;
  });

  const handleSubmitSolicitud = async (data: any) => {

    try {

      if (!user?.email) {
        alert("Debes iniciar sesión");
        return;
      }

      // Obtener usuario desde backend
      const usuario = await api.getUsuarioPorCorreo(user.email);

      // MAPEAR CATEGORÍA -> ID
      const categoriasMap: Record<string, number> = {
        "Alimentos": 1,
        "Transporte": 2,
        "Cuidado de Niños": 3,
        "Educación": 4,
        "Salud": 5,
        "Hogar": 6,
        "Otro": 7,
      };

      const nuevaSolicitud = {

        titulo: data.titulo,

        descripcion: data.descripcion,

        ubicacion: data.ubicacion,

        usuario: {
          idUsuario: usuario.idUsuario
        },

        // AQUÍ ESTABA EL ERROR
        categoria: {
          idCategoria: categoriasMap[data.categoria]
        },

        estado: {
          idEstado: 1
        },

        urgencia: {
          idUrgencia: Number(data.id_urgencia)
        }
      };

      console.log("ENVIANDO:", nuevaSolicitud);

      await api.crearSolicitud(nuevaSolicitud);

      // RECARGAR SOLICITUDES
      const solicitudesActualizadas = await api.getSolicitudes();

      const mapeadas = solicitudesActualizadas.map((s: any) => ({

        id: String(s.idSolicitud),

        titulo: s.titulo,

        categoria: s.categoria?.nombreCategoria ?? "Otro",

        descripcion: s.descripcion,

        ubicacion: s.ubicacion ?? "SJL",

        estado:
          s.estado?.nombreEstado
            ?.toLowerCase()
            .replace("_", "-") ?? "abierta",

        autorNombre: s.usuario?.nombres ?? "Anónimo",

        autorIniciales:
          s.usuario?.nombres
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")
            .slice(0, 2) ?? "??",

        fecha: new Date(s.fechaSolicitud).toLocaleDateString(
          "es-PE",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        ),

        voluntariosActuales: 0,

        voluntariosNecesarios: 1,

      }));

      setSolicitudes(mapeadas);

      setModalSolicitar(false);

      alert("Solicitud creada correctamente");

    } catch (error) {

      console.error("ERROR COMPLETO:", error);

      alert("Error al crear solicitud");

    }

  };

  const handleSubmitOferta = async (
    solicitudId: string,
    data: any
  ) => {

    try {

      if (!user?.email) {
        alert("Debes iniciar sesión");
        return;
      }

      const usuario = await api.getUsuarioPorCorreo(user.email);

      const nuevaDonacion = {

        mensaje: data.mensaje,

        usuario: {
          idUsuario: usuario.idUsuario
        },

        solicitud: {
          idSolicitud: Number(solicitudId)
        }

      };

      await api.crearDonacion(nuevaDonacion);

      setModalOfrecer(null);

      alert("Oferta enviada correctamente");

    } catch (error) {

      console.error(error);

      alert("Error al enviar oferta");

    }
  };
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar
        onNuevaSolicitud={() => setModalSolicitar(true)}
        puedeCrearSolicitud={userRol !== "VOLUNTARIO"}
      />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px" }}>
        {/* Banner informativo */}
        <div style={{
          background: "#eff6ff", border: "1.5px solid #bfdbfe",
          borderRadius: "var(--radius)", padding: "16px 20px",
          display: "flex", gap: 14, marginBottom: 24,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "#3b82f6", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#1e40af", marginBottom: 4 }}>
              Sistema de Apoyo para Familias de Bajos Recursos
            </p>
            <p style={{ fontSize: 13, color: "#1d4ed8", lineHeight: 1.6 }}>
              Esta plataforma está diseñada exclusivamente para apoyar a personas en situación de vulnerabilidad económica{" "}
              <strong>del distrito de San Juan de Lurigancho. Todas las solicitudes son revisadas por un administrador antes de ser publicadas</strong>{" "}
              para garantizar que el apoyo llegue a quienes realmente lo necesitan. Si deseas solicitar ayuda, debes cumplir con los
              requisitos de elegibilidad (ingresos familiares mensuales menores a S/. 1,500).
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
          {/* Columna principal */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              <StatCard icon="doc" label="TOTAL" value={stats.total} />
              <StatCard icon="check-blue" label="ABIERTAS" value={stats.abiertas} />
              <StatCard icon="clock" label="EN PROGRE..." value={stats.enProgreso} />
              <StatCard icon="check-green" label="COMPLETA..." value={stats.completadas} />
            </div>

            {/* Filtros */}
            <div style={{
              background: "var(--surface)", border: "1.5px solid var(--border)",
              borderRadius: "var(--radius)", padding: 20,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 6h18M7 12h10M11 18h2" />
                </svg>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Filtros</span>
              </div>

              {/* Tabs estado */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
                background: "#f3f4f6", borderRadius: "var(--radius-sm)",
                padding: 4, gap: 2, marginBottom: 12,
              }}>
                {["Todas", "Abiertas", "Progreso", "Completadas"].map(t => (
                  <button key={t} onClick={() => setFiltroEstado(t)} style={{
                    padding: "8px 4px", border: "none", borderRadius: "var(--radius-sm)",
                    fontSize: 13, fontWeight: filtroEstado === t ? 600 : 400,
                    background: filtroEstado === t ? "white" : "transparent",
                    color: filtroEstado === t ? "var(--text-primary)" : "var(--text-secondary)",
                    cursor: "pointer",
                    boxShadow: filtroEstado === t ? "var(--shadow-sm)" : "none",
                    transition: "all 0.15s",
                  }}>{t}</button>
                ))}
              </div>

              {/* Tags categoría */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {CATEGORIAS.map(c => (
                  <button key={c} onClick={() => setFiltroCategoria(c)} style={{
                    padding: "5px 14px",
                    border: "1.5px solid " + (filtroCategoria === c ? "var(--text-primary)" : "var(--border)"),
                    borderRadius: "var(--radius-full)",
                    background: filtroCategoria === c ? "var(--text-primary)" : "transparent",
                    color: filtroCategoria === c ? "white" : "var(--text-secondary)",
                    fontSize: 13, fontWeight: filtroCategoria === c ? 600 : 400,
                    cursor: "pointer", transition: "all 0.15s",
                  }}>{c}</button>
                ))}
              </div>
            </div>

            {/* Grid de solicitudes */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {filtradas.length === 0 ? (
                <div style={{
                  gridColumn: "1/-1", textAlign: "center", padding: "48px 0",
                  color: "var(--text-muted)", fontSize: 14,
                }}>
                  No hay solicitudes con estos filtros.
                </div>
              ) : filtradas.map(s => (
                <SolicitudCard key={s.id} solicitud={s} onOfrecer={setModalOfrecer} />
              ))}
            </div>
          </div>

          {/* Sidebar ranking */}
          <RankingKI guerreros={guerreros} />
        </div>
      </main>

      {/* Modales */}
      {modalSolicitar && (
        <ModalSolicitar
          onClose={() => setModalSolicitar(false)}
          onSubmit={handleSubmitSolicitud}
        />
      )}
      {modalOfrecer && (
        <ModalOfrecer
          solicitud={modalOfrecer}
          onClose={() => setModalOfrecer(null)}
          onSubmit={handleSubmitOferta}
        />
      )}
    </div>
  );
}

// ---- Stat card ----
function StatCard({ icon, label, value }: { icon: string; value: number; label: string }) {
  const icons: Record<string, React.ReactNode> = {
    "doc": <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /></svg>,
    "check-blue": <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" /></svg>,
    "clock": <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>,
    "check-green": <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" /></svg>,
  };

  return (
    <div style={{
      background: "var(--surface)", border: "1.5px solid var(--border)",
      borderRadius: "var(--radius)", padding: "16px",
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, background: "#f9fafb",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>{icons[icon]}</div>
      <div>
        <p style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{value}</p>
        <p style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600, marginTop: 3, letterSpacing: "0.05em" }}>{label}</p>
      </div>
    </div>
  );
}
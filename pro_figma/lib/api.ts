const API_URL = "http://localhost:8080/api";

// =========================
// HEADERS AUTH
// =========================

const getHeaders = () => {

    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
};

export const api = {

    // =========================
    // AUTH ADMIN
    // =========================

    loginAdmin: async (
        correo: string,
        password: string
    ) => {

        const res = await fetch(
            `${API_URL}/admin/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    correo,
                    password,
                }),
            }
        );

        if (!res.ok) {
            throw new Error("Credenciales inválidas");
        }

        return res.json();
    },

    // =========================
    // USUARIOS
    // =========================

    getUsuarioPorCorreo: async (
        correo: string
    ) => {

        const res = await fetch(
            `${API_URL}/usuarios/correo/${correo}`,
            {
                headers: getHeaders(),
            }
        );

        if (res.status === 404) {
            throw new Error(
                "Usuario no encontrado"
            );
        }

        if (!res.ok) {
            throw new Error(
                "Error al obtener usuario"
            );
        }

        return res.json();
    },

    obtenerUsuarios: async () => {

        const res = await fetch(
            `${API_URL}/admin/usuarios`,
            {
                headers: getHeaders(),
            }
        );

        if (!res.ok) {
            throw new Error(
                "Error al obtener usuarios"
            );
        }

        return res.json();
    },

    crearUsuario: async (
        data: any
    ) => {

        const res = await fetch(
            `${API_URL}/usuarios`,
            {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(data),
            }
        );

        if (!res.ok) {
            throw new Error(
                "Error al crear usuario"
            );
        }

        return res.json();
    },

    actualizarUsuario: async (
        id: number,
        data: any
    ) => {

        const res = await fetch(
            `${API_URL}/admin/usuarios/${id}`,
            {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify(data),
            }
        );

        if (!res.ok) {
            throw new Error(
                "Error al actualizar usuario"
            );
        }

        return res.json();
    },

    eliminarUsuario: async (
        id: number
    ) => {

        const res = await fetch(
            `${API_URL}/admin/usuarios/${id}`,
            {
                method: "DELETE",
                headers: getHeaders(),
            }
        );

        if (!res.ok) {
            throw new Error(
                "Error al eliminar usuario"
            );
        }
    },

    cambiarRol: async (
        id: number,
        rol: string
    ) => {

        const res = await fetch(
            `${API_URL}/admin/usuarios/${id}/rol`,
            {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify({
                    rol,
                }),
            }
        );

        if (!res.ok) {
            throw new Error(
                "Error al cambiar rol"
            );
        }

        return res.json();
    },

    // =========================
    // SOLICITUDES
    // =========================

    obtenerSolicitudes: async () => {

        const res = await fetch(
            `${API_URL}/admin/solicitudes`,
            {
                headers: getHeaders(),
            }
        );

        if (!res.ok) {
            throw new Error(
                "Error al obtener solicitudes"
            );
        }

        return res.json();
    },

    getSolicitudes: async () => {

        const res = await fetch(
            `${API_URL}/solicitudes`,
            {
                headers: getHeaders(),
            }
        );

        if (!res.ok) {
            throw new Error(
                "Error al obtener solicitudes"
            );
        }

        return res.json();
    },

    getSolicitudesPorEstado: async (
        estado: string
    ) => {

        const res = await fetch(
            `${API_URL}/solicitudes/estado/${estado}`,
            {
                headers: getHeaders(),
            }
        );

        if (!res.ok) {
            throw new Error(
                "Error al obtener solicitudes"
            );
        }

        return res.json();
    },

    getSolicitudesPorCategoria: async (
        id: number
    ) => {

        const res = await fetch(
            `${API_URL}/solicitudes/categoria/${id}`,
            {
                headers: getHeaders(),
            }
        );

        if (!res.ok) {
            throw new Error(
                "Error al obtener solicitudes"
            );
        }

        return res.json();
    },

    getSolicitudesPorUsuario: async (
        id: number
    ) => {

        const res = await fetch(
            `${API_URL}/solicitudes/usuario/${id}`,
            {
                headers: getHeaders(),
            }
        );

        if (!res.ok) {
            throw new Error(
                "Error al obtener solicitudes"
            );
        }

        return res.json();
    },

    crearSolicitud: async (
        data: any
    ) => {

        const res = await fetch(
            `${API_URL}/solicitudes`,
            {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(data),
            }
        );

        if (!res.ok) {
            throw new Error(
                "Error al crear solicitud"
            );
        }

        return res.json();
    },

    actualizarSolicitud: async (
        id: number,
        data: any
    ) => {

        const res = await fetch(
            `${API_URL}/admin/solicitudes/${id}`,
            {
                method: "PUT",
                headers: getHeaders(),
                body: JSON.stringify(data),
            }
        );

        if (!res.ok) {
            throw new Error(
                "Error al actualizar solicitud"
            );
        }

        return res.json();
    },

    eliminarSolicitud: async (
        id: number
    ) => {

        const res = await fetch(
            `${API_URL}/admin/solicitudes/${id}`,
            {
                method: "DELETE",
                headers: getHeaders(),
            }
        );

        if (!res.ok) {
            throw new Error(
                "Error al eliminar solicitud"
            );
        }
    },

    aprobarSolicitud: async (
        id: number
    ) => {

        const res = await fetch(
            `${API_URL}/admin/solicitudes/${id}/aprobar`,
            {
                method: "PUT",
                headers: getHeaders(),
            }
        );

        if (!res.ok) {
            throw new Error(
                "Error al aprobar solicitud"
            );
        }

        return res.json();
    },

    rechazarSolicitud: async (
        id: number
    ) => {

        const res = await fetch(
            `${API_URL}/admin/solicitudes/${id}/rechazar`,
            {
                method: "PUT",
                headers: getHeaders(),
            }
        );

        if (!res.ok) {
            throw new Error(
                "Error al rechazar solicitud"
            );
        }

        return res.json();
    },

    // =========================
    // VOLUNTARIOS
    // =========================

    getVoluntarios: async () => {

        const res = await fetch(
            `${API_URL}/voluntarios`,
            {
                headers: getHeaders(),
            }
        );

        if (!res.ok) {
            throw new Error(
                "Error al obtener voluntarios"
            );
        }

        return res.json();
    },

    crearVoluntario: async (
        data: any
    ) => {

        const res = await fetch(
            `${API_URL}/voluntarios`,
            {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(data),
            }
        );

        if (!res.ok) {
            throw new Error(
                "Error al crear voluntario"
            );
        }

        return res.json();
    },

    // =========================
    // CATEGORÍAS
    // =========================

    getCategorias: async () => {

        const res = await fetch(
            `${API_URL}/categorias`,
            {
                headers: getHeaders(),
            }
        );

        if (!res.ok) {
            throw new Error(
                "Error al obtener categorías"
            );
        }

        return res.json();
    },

    // =========================
    // ESTADOS
    // =========================

    getEstados: async (
        tipoTabla: string
    ) => {

        const res = await fetch(
            `${API_URL}/estados/tabla/${tipoTabla}`,
            {
                headers: getHeaders(),
            }
        );

        if (!res.ok) {
            throw new Error(
                "Error al obtener estados"
            );
        }

        return res.json();
    },

    // =========================
    // DONACIONES
    // =========================

    getDonaciones: async () => {

        const res = await fetch(
            `${API_URL}/donaciones`,
            {
                headers: getHeaders(),
            }
        );

        if (!res.ok) {
            throw new Error(
                "Error al obtener donaciones"
            );
        }

        return res.json();
    },

    getDonacionesPorSolicitud: async (
        id: number
    ) => {

        const res = await fetch(
            `${API_URL}/donaciones/solicitud/${id}`,
            {
                headers: getHeaders(),
            }
        );

        if (!res.ok) {
            throw new Error(
                "Error al obtener donaciones"
            );
        }

        return res.json();
    },

    crearDonacion: async (
        data: any
    ) => {

        const res = await fetch(
            `${API_URL}/donaciones`,
            {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(data),
            }
        );

        if (!res.ok) {
            throw new Error(
                "Error al crear donación"
            );
        }

        return res.json();
    },
};
const API_URL = "http://localhost:8080/api";

export const api = {

    // =========================
    // USUARIOS
    // =========================

    getUsuarioPorCorreo: async (correo: string) => {

        const res = await fetch(
            `${API_URL}/usuarios/correo/${correo}`
        );

        if (res.status === 404) {
            throw new Error("Usuario no encontrado");
        }

        if (!res.ok) {
            throw new Error("Error al obtener usuario");
        }

        return res.json();
    },

    obtenerUsuarios: async () => {

        const res = await fetch(
            `${API_URL}/usuarios`
        );

        if (!res.ok) {
            throw new Error("Error al obtener usuarios");
        }

        return res.json();
    },

    crearUsuario: async (data: any) => {

        const res = await fetch(
            `${API_URL}/usuarios`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        if (!res.ok) {
            throw new Error("Error al crear usuario");
        }

        return res.json();
    },

    actualizarUsuario: async (id: number, data: any) => {

        const res = await fetch(
            `${API_URL}/usuarios/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        if (!res.ok) {
            throw new Error("Error al actualizar usuario");
        }

        return res.json();
    },

    eliminarUsuario: async (id: number) => {

        const res = await fetch(
            `${API_URL}/usuarios/${id}`,
            {
                method: "DELETE",
            }
        );

        if (!res.ok) {
            throw new Error("Error al eliminar usuario");
        }
    },

    // =========================
    // SOLICITUDES
    // =========================

    getSolicitudes: async () => {

        const res = await fetch(
            `${API_URL}/solicitudes`
        );

        if (!res.ok) {
            throw new Error("Error al obtener solicitudes");
        }

        return res.json();
    },

    obtenerSolicitudes: async () => {

        const res = await fetch(
            `${API_URL}/solicitudes`
        );

        if (!res.ok) {
            throw new Error("Error al obtener solicitudes");
        }

        return res.json();
    },

    getSolicitudesPorEstado: async (estado: string) => {

        const res = await fetch(
            `${API_URL}/solicitudes/estado/${estado}`
        );

        if (!res.ok) {
            throw new Error("Error al obtener solicitudes");
        }

        return res.json();
    },

    getSolicitudesPorCategoria: async (id: number) => {

        const res = await fetch(
            `${API_URL}/solicitudes/categoria/${id}`
        );

        if (!res.ok) {
            throw new Error("Error al obtener solicitudes");
        }

        return res.json();
    },

    getSolicitudesPorUsuario: async (id: number) => {

        const res = await fetch(
            `${API_URL}/solicitudes/usuario/${id}`
        );

        if (!res.ok) {
            throw new Error("Error al obtener solicitudes");
        }

        return res.json();
    },

    crearSolicitud: async (data: any) => {

        const res = await fetch(
            `${API_URL}/solicitudes`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        if (!res.ok) {
            throw new Error("Error al crear solicitud");
        }

        return res.json();
    },

    actualizarSolicitud: async (id: number, data: any) => {

        const res = await fetch(
            `${API_URL}/solicitudes/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        if (!res.ok) {
            throw new Error("Error al actualizar solicitud");
        }

        return res.json();
    },

    eliminarSolicitud: async (id: number) => {

        const res = await fetch(
            `${API_URL}/solicitudes/${id}`,
            {
                method: "DELETE",
            }
        );

        if (!res.ok) {
            throw new Error("Error al eliminar solicitud");
        }
    },

    // =========================
    // VOLUNTARIOS
    // =========================

    getVoluntarios: async () => {

        const res = await fetch(
            `${API_URL}/voluntarios`
        );

        if (!res.ok) {
            throw new Error("Error al obtener voluntarios");
        }

        return res.json();
    },

    crearVoluntario: async (data: any) => {

        const res = await fetch(
            `${API_URL}/voluntarios`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        if (!res.ok) {
            throw new Error("Error al crear voluntario");
        }

        return res.json();
    },

    // =========================
    // CATEGORÍAS
    // =========================

    getCategorias: async () => {

        const res = await fetch(
            `${API_URL}/categorias`
        );

        if (!res.ok) {
            throw new Error("Error al obtener categorías");
        }

        return res.json();
    },

    // =========================
    // ESTADOS
    // =========================

    getEstados: async (tipoTabla: string) => {

        const res = await fetch(
            `${API_URL}/estados/tabla/${tipoTabla}`
        );

        if (!res.ok) {
            throw new Error("Error al obtener estados");
        }

        return res.json();
    },

    // =========================
    // DONACIONES
    // =========================

    getDonaciones: async () => {

        const res = await fetch(
            `${API_URL}/donaciones`
        );

        if (!res.ok) {
            throw new Error("Error al obtener donaciones");
        }

        return res.json();
    },

    getDonacionesPorSolicitud: async (id: number) => {

        const res = await fetch(
            `${API_URL}/donaciones/solicitud/${id}`
        );

        if (!res.ok) {
            throw new Error("Error al obtener donaciones");
        }

        return res.json();
    },

    crearDonacion: async (data: any) => {

        const res = await fetch(
            `${API_URL}/donaciones`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        if (!res.ok) {
            throw new Error("Error al crear donación");
        }

        return res.json();
    },
};
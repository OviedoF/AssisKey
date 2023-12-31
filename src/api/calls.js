import axios from "axios";

const request = axios.create({
    baseURL: 'https://app.projectbms.com/apibms/Api',
});

const petitions = {};

petitions.login = ({usuario, clave}) => {
    try {
        const data = request.get(`/Login`, {
            headers: {
                usuario,
                contra: clave
            }
        });
        return data;
    } catch (error) {
        console.log(error);
        return data;
    }
}

petitions.getUserInfo = (form) => {
    try {
        const data = request.get(`/empleado`, {
            headers: {
                ...form,
            }
        });
        return data;
    } catch (error) {
        console.log(error);
        return data;
    }
}

petitions.listaAsistencia = (form, token) => {
    try {
        const data = request.get(`/listasistencia`, {
            headers: {
                ...form,
            }
        });
        return data;
    } catch (error) {
        console.log(error);
        return data;
    }
}

petitions.entryGeo = (form) => {
    try {
        const data = request.get(`/registroAsistenciaGeo`, {
            headers: {
                ...form,
            }
        });
        return data;
    } catch (error) {
        console.log(error);
        return data;
    }
}

petitions.entryQR = (form) => {
    try {
        const data = request.get(`/registroAsistenciaQR`, {
            headers: {
                ...form,
            }
        });
        return data;
    } catch (error) {
        console.log(error);
        return data;
    }
}

petitions.updateUser = (form) => {
    try {
        const data = request.get(`/updtrabajador`, {
            headers: {
                ...form,
            }
        });
        return data;
    } catch (error) {
        console.log(error);
        return data;
    }
}

petitions.updatePassword = (form) => {
    try {
        const data = request.get(`/updatePassword`, {
            headers: {
                ...form,
            }
        });
        return data;
    } catch (error) {
        console.log(error);
        return data;
    }
}

petitions.verifyDocument = (form) => {
    try {
        const data = request.get(`/empleado`, {
            headers: {
                ...form,
            }
        });
        return data;
    } catch (error) {
        console.log(error);
        return data;
    }
}

petitions.permisoListado = (form) => {
    try {
        const data = request.get(`/permisolistado`, {
            headers: {
                ...form,
            }
        });
        return data;
    } catch (error) {
        console.log(error);
        return data;
    }
}

petitions.getHorarios = (form) => {
    try {
        const data = request.get(`/horarioTrabajador`, {
            headers: {
                ...form,
            }
        });
        return data;
    } catch (error) {
        console.log(error);
        return data;
    }
}

petitions.getMotivos = (form) => {
    try {
        const data = request.get(`/motivos`, {
            headers: {
                ...form,
            }
        });
        return data;
    } catch (error) {
        console.log(error);
        return data;
    }
}

petitions.getEstados = (form) => {
    try {
        const data = request.get(`/estados`, {
            headers: {
                ...form,
            }
        });
        return data;
    
    }
    catch (error) {
        console.log(error);
        return data;
    }
}

petitions.crearPermiso = (form) => {
    try {
        const data = request.get(`/permiso`, {
            headers: {
                ...form,
            }
        });
        return data;
    } catch (error) {
        console.log(error);
        return data;
    }
}

export default petitions;
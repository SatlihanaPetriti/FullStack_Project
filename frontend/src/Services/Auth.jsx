import { authAxios } from './axiosConfig';

export async function register_service(data) {
    return await authAxios.post('/auth/register', {
        name: data.name,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
    });
}

export async function login_service(data) {
    return await authAxios.post('/auth/login', {
        email: data.email,
        password: data.password,
    });
}

export async function logout_service() {
    return await authAxios.post('/auth/logout');
}

// kur behet login backend krijon nje sesion dhe dergon nje cookie
// me withCredentials:true kjo cookie ruhet  ne browser
// per kerkesat e ardhshme cookie dergohet automatikisht
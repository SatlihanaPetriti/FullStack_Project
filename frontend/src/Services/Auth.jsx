import axios from "axios";
const URL = `${import.meta.env.VITE_BACKEND_URL}/auth`;

const register_user = async (data) => {
    return axios.post(`${URL}/register/`, data)
}

const login_user = async (data) => {
    console.log("Login payload:", data);
    const response = await axios.post(`${URL}/login`, data);
    console.log("response from backend:", response);
    console.log("User from backend:", response.data);
    return response;
}

const logout_user = async () => {
    const result = await axios.post(`${URL}/logout`);
    return result;
}

const checkAuth_user_service = async () => {
    const result = await axios.get(`${URL}/checkUser`);
    return result;
}
const forgotPassword_service = async (email) => {
    return axios.post(`${URL}/forgot-password`, { email });
}

const resetPassword_service = async (token, password) => {
    return axios.post(`${URL}/reset-password`, { token, password });
}


export { register_user, login_user, logout_user, checkAuth_user_service, forgotPassword_service, resetPassword_service }


import axios from "axios";
const URL = "http://localhost:3000/auth";

const register_user = async (data) => {
    return axios.post(`${URL}/register/`, data)
}

const login_user = async (data) => {
    return axios.post(`${URL}/login`, data)
}

const logout_user = async () => {
    const result = await axios.post(`${URL}/logout`);
    return result;
}

const checkAuth_user_service = async () => {
    const result = await axios.get(`${URL}/checkUser`);
    return result;
}

export { register_user, login_user, logout_user, checkAuth_user_service }
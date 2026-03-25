import axios from 'axios';

// per kerkesat qe kerkojne login, register, logout
// dergohet cooki si id se bashku me kerkesen
export const authAxios = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
});

// kerkesat publike qe nuk kerkojne autentikim
export const publicAxios = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: false
});

// nuk vendoset ne global service pasi ndikon ne te gjitha kerkesat
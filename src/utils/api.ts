import axios, {AxiosInstance} from "axios";
import {useAuth} from "../components/hooks/Auth";
import {message} from "antd";


let api: AxiosInstance | null = null;

const useAxios = () => {

    const {logout} = useAuth();

    if (api) {
        return api;
    }
    api = axios.create({
        baseURL: "http://localhost:8080/v1",
    });

    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("authToken");
            if (token) {
                console.log("Token exists:", token);
                config.headers.Authorization = `Bearer ${token}`;
                console.log("Config after setting token:", config);
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response) {
                if (error.response && error.response.status === 401) {
                    logout(); // Logout user if token is invalid or expired
                }
                message.error(error.response.data.message || "An unexpected error occurred.");
            }
            return Promise.reject(error);
        }
    );

    return api;

}

export default useAxios;

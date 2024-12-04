import axios from "axios";
import {useError} from "../context/ErrorContext";


const useAuthAxios = () => {
    const {setError} = useError();
    const api = axios.create({
        baseURL: "http://localhost:8081/v1",
    });

    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("authToken");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
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
                setError(error.response.data.message || "An unexpected error occurred.");
            }
            return Promise.reject(error);
        }
    );

    return api;

}

export default useAuthAxios;

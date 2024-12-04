import axios, {AxiosInstance} from "axios";
import {useError} from "../context/ErrorContext";

let authApi: AxiosInstance;

const useAuthAxios = () => {
    const {setError} = useError();


    if (authApi) {
        return authApi;
    }
    authApi = axios.create({
        baseURL: "http://localhost:8081/v1",
    });

    authApi.interceptors.request.use(
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

    authApi.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response) {
                setError(error.response.data.message || "An unexpected error occurred.");
            }
            return Promise.reject(error);
        }
    );

    return authApi;

}

export default useAuthAxios;

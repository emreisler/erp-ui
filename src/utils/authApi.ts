import axios, {AxiosInstance} from "axios";
import {message} from "antd";

let authApi: AxiosInstance;

const useAuthAxios = () => {


    if (authApi) {
        return authApi;
    }
    authApi = axios.create({
        baseURL: "http://217.76.56.9/v1",
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
            // if (error.response) {
            //     message.error(error.response.data.message || "An unexpected error occurred.")
            // }
            return Promise.reject(error);
        }
    );

    return authApi;

}

export default useAuthAxios;

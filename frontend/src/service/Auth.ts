import axios, { AxiosInstance } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type AuthProps = {
  login: (username: string, password: string) => any;
  isLoggedIn: boolean;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  signup: (username: string, password: string) => Promise<any>;
  createAxiosWithInterceptor: () => AxiosInstance;
}


export function useAuth(): AuthProps {

    const navigate = useNavigate()

    const getInitialLoggedInValue = () => {
        const loggedIn = localStorage.getItem("isLoggedIn");
        return loggedIn !== null && loggedIn === "true";
      };

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>((getInitialLoggedInValue))

    const getUserDetails = async () =>{
        try {
            const userId = localStorage.getItem("user_id")
            const response = await axios.get(
                `http://127.0.0.1:8000/api/users/?user_id=${userId}`,
                {
                    withCredentials: true
                }
            );
            const userDetails = response.data
            localStorage.setItem("username", userDetails.username);
            setIsLoggedIn(true);
            localStorage.setItem("isLoggedIn", "true")
        } catch (err: any) {
            setIsLoggedIn(false)
            localStorage.setItem("isLoggedIn", "false")
            return err;
        }
    }

    const login = async (username: string, password: string) =>{
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/token/", {
                    username,
                    password,
            }, { withCredentials: true }
            );

            const user_id = response.data.user_id
            console.log(response.data)
            localStorage.setItem("isLoggedIn", "true")
            localStorage.setItem("user_id", user_id)
            setIsLoggedIn(true)
            getUserDetails()

        } catch (err: any) {
            return err.response.status;
        }
    }

    const refreshAccessToken = async () => {
        try {
            await axios.post(
                `http://127.0.0.1:8000/api/token/refresh/`, {} , {withCredentials:true}
            )
        } catch (refreshError) {
            return Promise.reject(refreshError)
        }
    }

    const signup = async (username: string, password: string) =>{
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/register/", {
                    username,
                    password,
            }, { withCredentials: true }
            );
            return response.status
        } catch (err: any) {
            return err.response.status;
        }
    }


    const logout = async () => {
        localStorage.setItem("isLoggedIn", "false")
        localStorage.removeItem("user_id")
        localStorage.removeItem("username");
        setIsLoggedIn(false);
        navigate("/login")

        try {
            await axios.post(
                `http://127.0.0.1:8000/api/logout/`, {} , {withCredentials:true}
            )
        } catch (refreshError) {
            return Promise.reject(refreshError)
        }


      }


      const createAxiosWithInterceptor = () => {
        const jwtAxios = axios.create({});

        jwtAxios.interceptors.response.use(
          (response) => {
            return response;
          },
          async (error) => {
            const originalRequest = error.config;
            if (error.response.status === 401 || error.response.status === 403) {
              axios.defaults.withCredentials = true;

                try {
                  const response = await axios.post(
                    "http://127.0.0.1:8000/api/token/refresh/"
                  );
                  if (response["status"] == 200) {
                    return jwtAxios(originalRequest);
                  }
                } catch (refreshError) {
                  logout()
                  const goLogin = () => navigate("/login");
                  goLogin();
                  return Promise.reject(refreshError);
                }

            }
            return Promise.reject(error);
          }
        );
        return jwtAxios;
      };

    return {login, isLoggedIn, logout, refreshAccessToken, signup, createAxiosWithInterceptor}

}

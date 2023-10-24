import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../service/Auth";
import { BASEURL } from "../config";
import { useEffect } from "react";

const jwtAxios = axios.create({ withCredentials: true });

const useAxiosWithJwtInterceptor = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const interceptorId = jwtAxios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 || error.response.status === 403) {
          axios.defaults.withCredentials = true;

          try {
            const response = await axios.post(`${BASEURL}/token/refresh/`);
            if (response["status"] == 200) {
              console.log("originalRequest", originalRequest);

              return jwtAxios(originalRequest);
            }
          } catch (refreshError) {
            logout();
            const goLogin = () => navigate("/login");
            goLogin();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      jwtAxios.interceptors.response.eject(interceptorId);
    };
  }, []);

  return jwtAxios;
};

export default useAxiosWithJwtInterceptor;

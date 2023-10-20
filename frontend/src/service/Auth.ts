import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type AuthProps = {
  login: (username: string, password: string) => any;
  isLoggedIn: boolean;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  signup: (username: string, password: string) => Promise<any>;
};

export function useAuth(): AuthProps {
  const navigate = useNavigate();

  const getInitialLoggedInValue = () => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    return loggedIn !== null && loggedIn === "true";
  };

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    getInitialLoggedInValue
  );

  const getUserDetails = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      const response = await axios.get(
        `http://localhost:8000/api/users/?user_id=${userId}`,

        {
          withCredentials: true,
        }
      );
      const userDetails = response.data;
      console.log("User details: " + userDetails);
      localStorage.setItem("username", userDetails.username);
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
    } catch (err: any) {
      setIsLoggedIn(false);
      localStorage.setItem("isLoggedIn", "false");
      return err;
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/token/",
        {
          username,
          password,
        },
        { withCredentials: true }
      );

      const user_id = response.data.user_id;
      console.log(response.data);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user_id", user_id);
      // localStorage.setItem("access_token", response.data.access);
      // localStorage.setItem("refresh_token", response.data.access);
      setIsLoggedIn(true);
      getUserDetails();
    } catch (err: any) {
      return err.response.status;
    }
  };

  const refreshAccessToken = async () => {
    try {
      await axios.post(
        `http://localhost:8000/api/token/refresh/`,
        {},
        { withCredentials: true }
      );
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  };

  const signup = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/register/",
        {
          username,
          password,
        },
        { withCredentials: true }
      );
      return response.status;
    } catch (err: any) {
      return err.response.status;
    }
  };

  const logout = async () => {
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/login");

    try {
      await axios.post(
        `http://localhost:8000/api/logout/`,
        {},
        { withCredentials: true }
      );
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  };

  return {
    login,
    isLoggedIn,
    logout,
    refreshAccessToken,
    signup,
  };
}

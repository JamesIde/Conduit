import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { AccessTokenSuccess, UserSignInSuccess } from "../types/User";
import { conduitDomain } from "./URLs";

const baseClient = axios.create({
  baseURL: `http://localhost:3000`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
  if (localStorage.getItem("user")) {
    const user: UserSignInSuccess = JSON.parse(localStorage.getItem("user"));
    config.headers!["Authorization"] = `Bearer ${user.token}`;
    return config;
  } else {
    return config;
  }
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response;
};

const onResponseError = async (error: AxiosError) => {
  const originalConfig = error.config;
  if (error.response) {
    if (error.response.status == 401) {
      try {
        console.log("unauthorized... refreshing");
        axios.defaults.withCredentials = true;
        const { data } = await baseClient.get(`/auth/refresh_token`);

        const rs = data as AccessTokenSuccess;

        console.log("new token received", data.accessToken);

        const user: UserSignInSuccess = JSON.parse(
          localStorage.getItem("user")
        );
        console.log("old user token", user.token);
        user.token = rs.accessToken;
        console.log("new user token", user.token);
        localStorage.setItem("user", JSON.stringify(user));
        console.log("updated user in local storage");
        //Return the original request with new token
        return baseClient(originalConfig);
      } catch (_error) {
        return Promise.reject(_error);
      }
    }
  }
  return Promise.reject(error);
};

baseClient.interceptors.response.use(onResponse, onResponseError);
baseClient.interceptors.request.use(onRequest, onRequestError);

export default baseClient;

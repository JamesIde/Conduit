import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { AccessTokenSuccess, Profile } from "../../types/User";

const baseClient = axios.create({
  // This needs to be updated to run locally (nginx routes /api/v1 to backend in k8s)
  baseURL: process.env.REACT_APP_SERVER_DOMAIN,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// https://thedutchlab.com/blog/using-axios-interceptors-for-refreshing-your-api-token
const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
  if (localStorage.getItem("user")) {
    const user: Profile = JSON.parse(localStorage.getItem("user"));
    config.headers!["Authorization"] = `Bearer ${user.token.accessToken}`;
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
        axios.defaults.withCredentials = true;
        const { data } = await baseClient.get(`/identity/refresh_token`);
        const rs = data as AccessTokenSuccess;
        const user: Profile = JSON.parse(localStorage.getItem("user"));
        user.token.accessToken = rs.accessToken;
        localStorage.setItem("user", JSON.stringify(user));
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

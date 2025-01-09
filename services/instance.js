import axios from "axios";
// import Cookies from 'js-cookie';
import {
  PUBLISHABLE_API_KEY,
  REACT_NATIVE_PUBLIC_DEV_URL,
  REGIOD_ID,
} from "../env";

export const baseURL = REACT_NATIVE_PUBLIC_DEV_URL;

export const instance = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const makeRequest = async (type, path, body = null, options = {}) => {
  try {
    // Retrieve token from cookies
    // const token = Cookies.get('auth-token');
    const token = false;

    // Setup headers
    const headers = {
      ...options.headers,
      // 'auth-token': token ? token : null,
      "x-publishable-api-key": PUBLISHABLE_API_KEY,
      "region_id": REGIOD_ID,
    };

    // If the body is an instance of FormData, set the appropriate Content-Type
    if (body instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    } else if (body) {
      headers["Content-Type"] = "application/json";
    }

    // Create the config object
    const config = {
      timeout: 30000,
      headers,
      ...options,
    };

    let response;

    // Perform the request based on the type
    switch (type.toUpperCase()) {
      case "GET":
        response = await instance.get(path, config);
        break;
      case "POST":
        response = await instance.post(path, body, config);
        break;
      case "PUT":
        response = await instance.put(path, body, config);
        break;
      case "PATCH":
        response = await instance.patch(path, body, config);
        break;
      case "DELETE":
        response = await instance.delete(path, config);
        break;
      default:
        throw new Error("Unsupported request type");
    }

    return response;
  } catch (error) {
    console.error("Error making request:", error);

    // Handle specific errors
    if (error.response?.status === 401) {
      // Handle unauthorized error, such as refreshing tokens or redirecting
      // ToastNotification('error', 'Session expired. Please login again');
    } else if (error.code === "ECONNABORTED") {
      // Handle timeout
      // ToastNotification('error', 'Request timed out');
    }

    throw error; // Re-throw error after logging/handling
  }
};

// Optional: Request interceptor for adding authentication or other common headers
instance.interceptors.request.use(
  (config) => {
    // Example: Add basic auth or other configuration if needed
    // config.auth = { username, password };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Response interceptor for handling global responses or errors
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle 401 errors, e.g., redirect or clear local storage
      // window.location.reload(true);
      // window.location.href = '/';
      // window.localStorage.clear();
    }
    const code = error.response?.status;
    return Promise.reject({ code });
  }
);

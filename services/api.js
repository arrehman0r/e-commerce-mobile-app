import { PUBLISHABLE_API_KEY, REACT_NATIVE_PUBLIC_AUTH_URL, REGIOD_ID } from "../env";
import { showToast } from "../store/actions/toast";
import { makeRequest } from "./instance";

export const getAllCategories = () => {
  return makeRequest("get", "product-categories");
}


export const getCategoryProducts = async (categoryId, params = {}) => {
  const searchParams = new URLSearchParams({
    ...params,
    "category_id[]": categoryId,
    "region_id": REGIOD_ID
  });

  return makeRequest("get", `products?${searchParams.toString()}`);
}

export const userLogin = async (body, dispatch) => {
  try {
    const response = await fetch(`${REACT_NATIVE_PUBLIC_AUTH_URL}auth/customer/emailpass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Login failed with status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    const errorMessage = error?.message || 'Login token failed. Please try again.';
    dispatch(showToast(errorMessage));

    throw error;
  }
};

export const getRegistrationToken = async (credentials, dispatch) => {
  try {
    const response = await fetch(`${REACT_NATIVE_PUBLIC_AUTH_URL}auth/customer/emailpass/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Registration failed with status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    const errorMessage = error?.message || 'Registration token failed. Please try again.';
    dispatch(showToast(errorMessage));

    throw error;
  }
};

export const registerUser = async (customerData, token) => {
  try {
    return await makeRequest("post", "customers", customerData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "x-publishable-api-key": PUBLISHABLE_API_KEY
      }
    });
  } catch (error) {
    console.error("Customer registration error:", error);
    throw error;
  }
};


export const getUserProfile = async (token) => {
  try {
      
    const response = await makeRequest("get", "customers/me", null, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "x-publishable-api-key": PUBLISHABLE_API_KEY
      }
    });
    
    console.log('Profile response:', response);
    return response;
  } catch (error) {
    if (error.code === 401) {
      console.error("Authentication failed. Token might be invalid or expired");
      // You might want to trigger a logout or token refresh here
    }
    console.error("Error on getting user:", error);
    throw error;
  }
};
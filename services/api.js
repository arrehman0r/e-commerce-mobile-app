import { PUBLISHABLE_API_KEY, REACT_NATIVE_PUBLIC_AUTH_URL, REACT_NATIVE_PUBLIC_DEV_URL, REGIOD_ID } from "../env";
import { showToast } from "../store/actions/toast";
import { makeRequest } from "./instance";

export const getAllCategories = () => {
  return makeRequest("get", "product-categories");
}
export const createCart = () => {
  return makeRequest("post", "carts", { region_id: REGIOD_ID })
}

export const addLineItem = (id, body) => {
  return makeRequest("post", `carts/${id}/line-items`, body)
}

export const getShippingOptions = (cartId) => {
  return makeRequest("get", `shipping-options?cart_id=${cartId}`)
}

export const getPaymentMethods = () => {
  return makeRequest("get", `payment-providers?region_id=${REGIOD_ID}`)
}

export const paymentCollection = (cartId) => {
  return makeRequest("post", `payment-collections`, { "cart_id": cartId })
}
export const createPaymentSession = (paymentId) => {
  return makeRequest("post", `payment-collections/${paymentId}/payment-sessions`, { "provider_id": "pp_system_default" })
}
export const getTaxes = (id) => {
  return makeRequest("post", `carts/${id}/taxes`)
}

export const addCartCustomerAddress = (cartId, body) => {
  return makeRequest("post", `carts/${cartId}`, body)
}
export const completeCart = (cartId) => {
  return makeRequest("POST", `carts/${cartId}/complete`);
};

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


export const getUserProfile = () => {


  return makeRequest("get", "customers/me")
}


export const getCustomerOrders = (params = {}) => {
  const queryString = new URLSearchParams({
    limit: params.limit || 5,
    offset: params.offset || 0
  }).toString();

  return makeRequest("get", `orders?${queryString}`);
}


export const getUserAddresses = () => {
  return makeRequest("get", "customers/me/addresses")
}

export const addUserAddress = (body) => {
  return makeRequest("post", "customers/me/addresses", body);
};

export const deleteUserAddress = (id) => {
  return makeRequest("DELETE", `customers/me/addresses/${id}`)
}
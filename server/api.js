import { makeRequest } from "./instance";

export const getAllCategories = () => {
    return makeRequest("get", "product-categories");
  }

  export const getCategoryProducts = (id) => {
    return makeRequest("get", `products?category_id[0]=${id}`);
  }

  export const createCart = (body) => {
    return makeRequest("post", "carts", body);
  };

  export const createCheckOut = (id) => {
    return makeRequest("post", `carts/${id}/payment-sessions`);
  };
  
  export const confirmOrder = (id) => {
    return makeRequest("post", `carts/${id}/complete`);
  };
  
  export const updateCart = (id, body) => {
    return makeRequest("post", `carts/${id}`, body);
  
  }
  
  export const addLineItem = (cartId, lineItem) => {
  
    return makeRequest("post", `carts/${cartId}/line-items`, lineItem)
  }
  
  export const getDeliveryCharges = (id, body) => {
    return makeRequest("post", `carts/${id}/shipping-methods`, body)
  }
  
  
  export const getShippingMethod = (regionId) => {
    return makeRequest("get", `shipping-options?region_id=${regionId}`)
  }


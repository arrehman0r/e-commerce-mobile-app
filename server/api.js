import { makeRequest } from "./instance";

export const getAllCategories = () => {
    return makeRequest("get", "product-categories");
  }

  export const getCategoryProducts = (id) => {
    return makeRequest("get", `products?category_id[0]=${id}`);
  }
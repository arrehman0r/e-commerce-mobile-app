import { makeRequest } from "./instance";

export const getAllCategories = () => {
    return makeRequest("get", "product-categories");
  }


export const getCategoryProducts = async (categoryId, params = {}) => {
  const searchParams = new URLSearchParams({
    ...params,
    "category_id[]": categoryId,
  });
  
  return makeRequest("get", `products?${searchParams.toString()}`);
}
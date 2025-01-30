import { REGIOD_ID } from "../env";
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
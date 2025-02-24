import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getAllCategories, getCategoryProducts, getCustomerOrders, getShippingOptions, getUserAddresses } from './api';

export const QUERY_KEYS = {
  CATEGORIES: 'categories',
  CATEGORY_PRODUCTS: 'category-products',
  SHIPPING_OPTIONS: 'shipping-options',
  CUSTOMER_ORDERS: 'customer-orders',
  USER_ADDRESSES: 'user-addresses',
};
export function useUserAddresses() {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_ADDRESSES],
    queryFn: getUserAddresses,
    staleTime: 1000 * 60 * 30, // 30 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useCustomerOrders() {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.CUSTOMER_ORDERS],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await getCustomerOrders({
        limit: 5,
        offset: pageParam
      });
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage?.count > (allPages.length * 5)) {
        return allPages.length * 5;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 30, // Consider data stale after 30 minutes
    cacheTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
export function useShippingOptions(cartId) {
  return useQuery({
    queryKey: [QUERY_KEYS.SHIPPING_OPTIONS, cartId],
    queryFn: async () => {
      const response = await getShippingOptions(cartId);
      console.log("response of shipping is",  response)
      return response?.shipping_options ?? [];
    },
    enabled: !!cartId,
    staleTime: 1000 * 60 * 30, // Consider data stale after 5 minutes
    cacheTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: async () => {
      const response = await getAllCategories();
      return response?.product_categories ?? [];
    },
  });
}


export function useCategoryProducts(categoryId) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.CATEGORY_PRODUCTS, categoryId],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await getCategoryProducts(categoryId, {
        limit: 20,
        offset: pageParam
      });
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.count > (allPages.length * 20)) {
        return allPages.length * 20;
      }
      return undefined;
    },
    enabled: !!categoryId,
  });
}
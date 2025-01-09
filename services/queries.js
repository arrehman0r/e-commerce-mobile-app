import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getAllCategories, getCategoryProducts } from './api';

export const QUERY_KEYS = {
  CATEGORIES: 'categories',
  CATEGORY_PRODUCTS: 'category-products',
};

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
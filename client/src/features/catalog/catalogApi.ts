// src/features/catalog/catalogApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import type { Product } from "../../app/models/product";
import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import type { Category } from "../../app/models/catagory";

export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: (builder) => ({
    // ✅ Accept page and limit as query params
    fetchProducts: builder.query<Product[], { page: number; limit?: number }>({
      query: ({ page, limit = 6 }) => ({
        url: `store?page=${page}&limit=${limit}`,
      }),
    }),

    fetchProductDetails: builder.query<Product, number>({
      query: (productId) => `store/product/${productId}`,
    }),

    fetchCategories: builder.query<Category[], void>({
      query: () => ({ url: "category" }),
    }),
  }),
});

export const {
  useFetchProductsQuery,
  useFetchProductDetailsQuery,
  useFetchCategoriesQuery,
} = catalogApi;

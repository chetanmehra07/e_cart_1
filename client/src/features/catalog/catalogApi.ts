// src/features/catalog/catalogApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import type { Product } from "../../app/models/product";

import { baseQueryWithErrorHandling } from "../../app/api/baseApi";
import type { Category } from "../../app/models/catagory";

export const catalogApi = createApi({
  reducerPath: "catalogApi",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: (builder) => ({
    fetchProducts: builder.query<Product[], void>({
      query: () => ({ url: "store" }),
    }),
    fetchProductDetails: builder.query<Product, number>({
      query: (productId) => `store/product/${productId}`,
    }),
    fetchCategories: builder.query<Category[], void>({
      query: () => ({ url: "category" }), // adjust endpoint as needed
    }),
  }),
});

export const {
  useFetchProductsQuery,
  useFetchProductDetailsQuery,
  useFetchCategoriesQuery,
} = catalogApi;

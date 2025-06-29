import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type CartItem = {
  cart_id: number;
  product_id: number;
  item_count: number;
  added_date: string;
  product_name: string;
  MRP: number;
  product_image: string;
  discount: number;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000" }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    fetchBasket: builder.query<CartItem[], number>({
      query: (loginid) => `/cart?loginid=${loginid}`,
      providesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation<
      void,
      {
        loginid: number;
        product_id: number;
        item_count: number;
        added_date: string;
      }
    >({
      query: (body) => ({
        url: "/cart/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    deleteCartItem: builder.mutation<
      void,
      { loginid: number; productid: number }
    >({
      query: ({ loginid, productid }) => ({
        url: `/cart/remove?loginid=${loginid}&productid=${productid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // ✅ NEW: Clear all cart items for a user
    clearCart: builder.mutation<void, number>({
      query: (loginid) => ({
        url: `/cart/clear?loginid=${loginid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useFetchBasketQuery,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
  useClearCartMutation, // ✅ Don't forget to export it
} = apiSlice;

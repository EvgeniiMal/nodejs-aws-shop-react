import axios, { AxiosError } from "axios";
import React from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import API_PATHS from "~/constants/apiPaths";
import { CartItem } from "~/models/CartItem";
import { buildAuthHeaders, useAuth } from "~/context/AuthContext";

export function useCart() {
  const { authToken } = useAuth();
  return useQuery<CartItem[], AxiosError>("cart", async () => {
    const res = await axios.get<CartItem[]>(`${API_PATHS.cart}`, {
      headers: buildAuthHeaders(authToken),
    });
    return res.data;
  });
}

export function useCartData() {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<CartItem[]>("cart");
}

export function useInvalidateCart() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("cart", { exact: true }),
    []
  );
}

export function useUpsertCart() {
  const { authToken } = useAuth();
  return useMutation((values: CartItem) =>
    axios.put<CartItem[]>(`${API_PATHS.cart}`, values, {
      headers: buildAuthHeaders(authToken),
    })
  );
}

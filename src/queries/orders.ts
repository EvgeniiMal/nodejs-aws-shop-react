import axios, { AxiosError } from "axios";
import React from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import API_PATHS from "~/constants/apiPaths";
import { OrderStatus } from "~/constants/order";
import { Order } from "~/models/Order";
import { buildAuthHeaders, useAuth } from "~/context/AuthContext";

type OrderResponse = {
  id: string;
  userId: string;
  cartId: string;
  payment: {
    type: string;
  };
  items: {
    productId: string;
    count: number;
  }[];
  delivery: {
    firstName: string;
    lastName: string;
    address: string;
    type: string;
  };
  status: string;
  total: number;
};

export function useOrders() {
  const { authToken } = useAuth();
  return useQuery<OrderResponse[], AxiosError>("orders", async () => {
    const res = await axios.get<OrderResponse[]>(`${API_PATHS.order}/order`, {
      headers: buildAuthHeaders(authToken),
    });
    return res.data;
  });
}

export function useInvalidateOrders() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("orders", { exact: true }),
    [queryClient]
  );
}

export function useUpdateOrderStatus() {
  const { authToken } = useAuth();
  return useMutation(
    (values: { id: string; status: OrderStatus; comment: string }) => {
      const { id, ...data } = values;
      return axios.put(`${API_PATHS.order}/order/${id}/status`, data, {
        headers: buildAuthHeaders(authToken),
      });
    }
  );
}

export function useSubmitOrder() {
  const { authToken } = useAuth();
  return useMutation((values: Omit<Order, "id">) => {
    return axios.put<Omit<Order, "id">>(`${API_PATHS.order}/order`, values, {
      headers: buildAuthHeaders(authToken),
    });
  });
}

export function useInvalidateOrder() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (id: string) =>
      queryClient.invalidateQueries(["order", { id }], { exact: true }),
    [queryClient]
  );
}

export function useDeleteOrder() {
  const { authToken } = useAuth();
  return useMutation((id: string) =>
    axios.delete(`${API_PATHS.order}/order/${id}`, {
      headers: buildAuthHeaders(authToken),
    })
  );
}

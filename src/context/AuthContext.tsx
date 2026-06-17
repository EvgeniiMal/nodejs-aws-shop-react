import axios, { AxiosRequestHeaders } from "axios";
import React, { createContext, useContext, useState } from "react";
import API_PATHS from "~/constants/apiPaths";

type LoginResponse =
  | {
      access_token: string;
    };

interface AuthContextValue {
  isAuthenticated: boolean;
  authToken?: string;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function buildAuthHeaders(authToken?: string): AxiosRequestHeaders {
  return authToken ? { Authorization: `Basic ${authToken}` } : {};
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authToken, setAuthToken] = useState<string>();
  const isAuthenticated = Boolean(authToken);

  const login = async (username: string, password: string) => {
    const response = await axios.post<LoginResponse>(API_PATHS.login, {
      username,
      password,
    });

    const tokenFromBody =response.data?.access_token;
    const authorizationHeader = response.headers?.authorization;
    const tokenFromHeader = authorizationHeader?.startsWith("Basic ")
      ? authorizationHeader.slice("Basic ".length)
      : authorizationHeader;
    const token = tokenFromBody || tokenFromHeader;

    if (!token) {
      throw new Error("Login API did not return token");
    }

    setAuthToken(token);
  };

  const logout = () => {
    setAuthToken(undefined);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

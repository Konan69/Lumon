import axios from "axios";
import { supabase } from "./supabaseClient";

const base = import.meta.env.VITE_BASE_URL;

export const isAuthenticated = async (): Promise<boolean> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session !== null;
};

export const getSupabaseToken = async (): Promise<string | null> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.access_token) {
    window.location.href = "/login";
    return null;
  }

  return session.access_token;
};

export const getAuthConfig = async () => {
  const token = await getSupabaseToken();

  if (!token) {
    return null;
  }

  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAuthRequest = async (path: string, alt?: boolean) => {
  const url = `${base}/${path}`;
  const authConfig = await getAuthConfig();

  if (!authConfig) {
    throw new Error("Authentication required, but no token found.");
  }

  try {
    const response = await axios.get(url, authConfig);
    if (alt) {
      return response;
    }
    return response.data;
  } catch (error) {
    console.error("GET request failed:", error);
    throw error;
  }
};

export const postAuthRequest = async (path: string, data: object) => {
  const url = `${base}/${path}`;
  const authConfig = await getAuthConfig();

  if (!authConfig) {
    throw new Error("Authentication required, but no token found.");
  }

  try {
    const response = await axios.post(url, data, authConfig);
    return response.data;
  } catch (error) {
    console.error("POST request failed:", error);
    throw error;
  }
};

export const patchAuthRequest = async (path: string, data: object) => {
  const url = `${base}/${path}`;
  const authConfig = await getAuthConfig();

  if (!authConfig) {
    throw new Error("Authentication required, but no token found.");
  }

  try {
    const response = await axios.patch(url, data, authConfig);
    return response.data;
  } catch (error) {
    console.error("PATCH request failed:", error);
    throw error;
  }
};

export const deleteAuthRequest = async (path: string) => {
  const url = `${base}/${path}`;
  const authConfig = await getAuthConfig();

  if (!authConfig) {
    throw new Error("Authentication required, but no token found.");
  }

  try {
    const response = await axios.delete(url, authConfig);
    return response.data;
  } catch (error) {
    console.error("DELETE request failed:", error);
    throw error;
  }
};

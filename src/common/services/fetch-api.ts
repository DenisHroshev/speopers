"use client";
import { navigate } from "@/common/services/navigate";

interface FetchApiProps {
  endpoint: string;
  options?: RequestInit;
  body?: object;
}

const baseUrl = "http://localhost:3001";

export const fetchApi = async ({ endpoint, options, body }: FetchApiProps) => {
  const url = baseUrl + endpoint;
  const preparedBody = body && { body: JSON.stringify(body) };
  const token = localStorage.getItem("token");

  const preparedOptions = {
    ...options,
    ...(preparedBody && preparedBody),
    headers: {
      "Access-Control-Allow-Origin": "*",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(body && { "Content-Type": "application/json" }),
    },
  };

  const response = await fetch(url, preparedOptions);

  if (response.status === 401) {
    localStorage.removeItem("token");
    return navigate("/login");
    // redirect("/login", RedirectType.replace);
    return;
  }

  if (!response.ok) {
    throw await response.json();
  }

  if (preparedOptions.method === "DELETE") return;

  return response.json();
};

export const fetchApiGet = async (fetchConfig: FetchApiProps) =>
  fetchApi({
    ...fetchConfig,
    options: { ...fetchConfig.options, method: "GET" },
  });

export const fetchApiPost = async (fetchConfig: FetchApiProps) =>
  fetchApi({
    ...fetchConfig,
    options: { ...fetchConfig.options, method: "POST" },
  });

export const fetchApiPatch = async (fetchConfig: FetchApiProps) =>
  fetchApi({
    ...fetchConfig,
    options: { ...fetchConfig.options, method: "PATCH" },
  });

export const fetchApiDelete = async (fetchConfig: FetchApiProps) =>
  fetchApi({
    ...fetchConfig,
    options: { ...fetchConfig.options, method: "DELETE" },
  });

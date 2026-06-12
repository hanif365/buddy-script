const apiClient = async (path: string, options: RequestInit = {}) => {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`/api${path}`, {
    credentials: "include",
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};

export default apiClient;

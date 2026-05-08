import Cookies from "js-cookie";

export async function fetchWithRefresh(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = Cookies.get("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    const refreshRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/admin/refresh`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!refreshRes.ok) {
      Cookies.remove("token");
      window.location.href = "/";
      return refreshRes;
    }

    const data = await refreshRes.json();
    const newToken = data.token;

    Cookies.set("token", newToken);

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
      },
    });
  }

  return res;
}
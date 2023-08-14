// set api root, removing trailing slashes
export const root = window.location.pathname.replace(/\/+$/, "");

export function asQueryParams(params) {
  return params
    ? "?" +
        Object.entries(params)
          .map(
            ([key, value]) => ![null, undefined, ""].includes(value) && [key, value].map(encodeURIComponent).join("=")
          )
          .filter(Boolean)
          .join("&")
    : "";
}

export async function query(url, params, options) {
  const fetchOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    ...options,
  };

  if (/get/i.test(fetchOptions.method)) {
    url += asQueryParams(params);
  } else {
    fetchOptions.body = JSON.stringify(params);
  }

  const response = await fetch(url, fetchOptions);
  return await response.json();
}

export const post = (resource, params) =>
  fetch(`${root}/${resource}`, {
    method: "post",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(params),
  }).then((r) => r.json());

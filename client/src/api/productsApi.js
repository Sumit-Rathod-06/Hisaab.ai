const BASE_URL = "http://localhost:5000/api/admin/products";

export const fetchProducts = async ({ published } = {}) => {
  const params = new URLSearchParams();

  if (published !== undefined) {
    params.append("published", published);
  }

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  return res.json();
};

export const createProduct = async (product) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  return res.json();
};

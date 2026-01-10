import React, { useEffect, useState } from "react";
import { fetchProducts } from "../../api/productsApi";

const ProductList = ({ refresh, published }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts({ published })
      .then((res) => {
        if (res.success) {
          setProducts(res.data.products);
        }
      })
      .catch(console.error);
  }, [refresh, published]);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Products</h2>

      {products.length === 0 && (
        <p className="text-gray-400">No products found</p>
      )}

      <div className="grid grid-cols-3 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-gray-900 border border-gray-700 rounded p-4"
          >
            <h3 className="font-bold">{p.product_name}</h3>
            <p className="text-sm text-gray-400">{p.product_category}</p>
            <p className="text-sm">Stock: {p.current_stock}</p>
            <p className="text-sm">₹ {p.sales_price}</p>
            <p className="text-xs mt-2">
              Status:{" "}
              <span
                className={
                  p.published ? "text-green-400" : "text-yellow-400"
                }
              >
                {p.published ? "Published" : "Draft"}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;

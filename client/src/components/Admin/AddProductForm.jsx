import React, { useState } from "react";
import { createProduct } from "../../api/productsApi";

const AddProductForm = ({ onProductAdded }) => {
  const [formData, setFormData] = useState({
    product_name: "",
    product_category: "",
    product_type: "",
    material: "",
    colors: "",
    current_stock: 0,
    sales_price: "",
    sales_tax: "",
    purchase_price: "",
    purchase_tax: "",
    published: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await createProduct(formData);

    if (res.success) {
      onProductAdded();
      alert("Product added");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 border border-gray-700 rounded-lg p-6 grid grid-cols-2 gap-4"
    >
      <input name="product_name" placeholder="Product Name" onChange={handleChange} required />
      <input name="product_category" placeholder="Category" onChange={handleChange} />
      <input name="product_type" placeholder="Type" onChange={handleChange} />
      <input name="material" placeholder="Material" onChange={handleChange} />
      <input name="colors" placeholder="Colors" onChange={handleChange} />
      <input type="number" name="current_stock" placeholder="Stock" onChange={handleChange} />
      <input name="sales_price" placeholder="Sales Price" onChange={handleChange} />
      <input name="sales_tax" placeholder="Sales Tax" onChange={handleChange} />
      <input name="purchase_price" placeholder="Purchase Price" onChange={handleChange} />
      <input name="purchase_tax" placeholder="Purchase Tax" onChange={handleChange} />

      <label className="col-span-2 flex items-center space-x-2">
        <input type="checkbox" name="published" onChange={handleChange} />
        <span>Publish immediately</span>
      </label>

      <button className="col-span-2 bg-yellow-600 text-black py-2 rounded">
        Add Product
      </button>
    </form>
  );
};

export default AddProductForm;

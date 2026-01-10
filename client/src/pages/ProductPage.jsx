import React, { useState } from "react";
import Navbar from "../Components/Admin/Navbar";
import AddProductForm from "../Components/Admin/AddProductForm";
import ProductList from "../Components/Admin/ProductList";

const ProductsPage = () => {
  const [refresh, setRefresh] = useState(false);
  const [published, setPublished] = useState(undefined);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="p-6">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button onClick={() => setPublished(undefined)}>All</button>
          <button onClick={() => setPublished(false)}>Draft</button>
          <button onClick={() => setPublished(true)}>Published</button>
        </div>

        <AddProductForm onProductAdded={() => setRefresh(!refresh)} />

        <ProductList refresh={refresh} published={published} />
      </div>
    </div>
  );
};

export default ProductsPage;

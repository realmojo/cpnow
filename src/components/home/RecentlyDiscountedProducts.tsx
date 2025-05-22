"use client";
import { useEffect, useState } from "react";
import ProductList from "../product/ProductOptions";

export default function RecentlyDiscountedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/productPrice");
      const data = await response.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="mt-6">
      <ProductList items={products} type="list" />
    </div>
  );
}

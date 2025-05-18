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
      <h2 className="scroll-m-20 text-2xl font-bold tracking-tight">
        방금 할인된 상품
      </h2>
      <ProductList items={products} type="list" />
    </div>
  );
}

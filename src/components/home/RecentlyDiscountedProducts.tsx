"use client";
import { useEffect, useState } from "react";
import ProductList from "../ProductList";

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

  return <ProductList items={products} type="grid" />;
}

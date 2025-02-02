import { useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useProductStore } from "../store/productStore";

export default function Home() {
  const { products, isLoading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts(); // Panggil fungsi untuk mengambil produk
  }, [fetchProducts]);

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      {/* <h1 className="text-4xl font-bold text-center mb-10">
        Welcome to Vailovent!
      </h1> */}
      <div className="grid grid-cols-1 gap-6">
        {products.length === 0 ? (
          <div>No products available!</div>
        ) : (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}

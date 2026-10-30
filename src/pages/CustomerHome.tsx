import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MarketHeader from "../components/MarketHeader";
import MarketHero from "../components/MarketHero";
import MarketFooter from "../components/MarketFooter";
import MarketCategories from "../components/MarketCategories";
import MarketProductCard, { type MarketProduct } from "../components/MarketProductCard";

export default function CustomerHome() {
  const [products, setProducts] = useState<MarketProduct[]>([]);
  const [category, setCategory] = useState<number | null>(null);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");
        const params = new URLSearchParams({ PageNumber: "1", PageSize: "12" });
        if (category !== null) params.set("CategoryId", String(category));
        if (search) params.set("ProductName", search);
        const response = await fetch(
          `https://store-api.softclub.tj/Product/get-products?${params}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("Unable to load products");
        const result = await response.json();
        setProducts(result.data.products);
      } catch {
        if (!controller.signal.aborted) setError("Unable to load products. Please try again.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadProducts();
    return () => controller.abort();
  }, [category, search]);

  const visibleProducts = category === null && !search
    ? products.filter((product) => product.hasDiscount)
    : products;

  return (
    <>
      <MarketHeader />
      <main className="mx-auto max-w-[1170px] px-[20px]">
        <div className="flex flex-col gap-[20px] md:flex-row md:gap-[40px]">
          <MarketCategories selected={category} onSelect={setCategory} />
          <MarketHero />
        </div>
        <section id="products" className="pb-[60px] pt-[70px]">
          <div className="mb-[20px] flex items-center gap-[14px] text-[16px] font-[700] text-[#DB4444]">
            <span className="h-[40px] w-[20px] rounded-[4px] bg-[#DB4444]" />
            Today's
          </div>
          <h1 className="mb-[36px] text-[30px] font-[700]">{search ? `Search: ${search}` : category === null ? "Flash Sales" : "Products"}</h1>
          {loading && <p>Loading products...</p>}
          {error && <p role="alert" className="text-[#DB4444]">{error}</p>}
          {!loading && !error && (
            <div className="grid grid-cols-2 gap-[24px] md:grid-cols-3 lg:grid-cols-4">
              {visibleProducts.map((product) => <MarketProductCard key={product.id} product={product} />)}
            </div>
          )}
          {!loading && !error && visibleProducts.length === 0 && <p>No products found.</p>}
        </section>
      </main>
      <MarketFooter />
    </>
  );
}

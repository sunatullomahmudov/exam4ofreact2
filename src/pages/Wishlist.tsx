import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MarketHeader from "../components/MarketHeader";
import MarketFooter from "../components/MarketFooter";

type WishlistProduct = {
  id: number;
  productName: string;
  price: number;
  hasDiscount: boolean;
  discountPrice: number;
  images: { id: number; images: string }[];
};

export default function Wishlist() {
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    async function loadWishlist() {
      try {
        const ids: number[] = JSON.parse(localStorage.getItem("fastcart.wishlist") || "[]");
        const responses = await Promise.all(ids.map((id) =>
          fetch(`https://store-api.softclub.tj/Product/get-product-by-id?id=${id}`, { signal: controller.signal }),
        ));
        if (responses.some((response) => !response.ok)) throw new Error("Unable to load wishlist");
        const results = await Promise.all(responses.map((response) => response.json()));
        setProducts(results.map((result) => result.data));
      } catch {
        if (!controller.signal.aborted) setError("Unable to load your wishlist. Please try again.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadWishlist();
    return () => controller.abort();
  }, []);

  function removeProduct(id: number) {
    try {
      const ids: number[] = JSON.parse(localStorage.getItem("fastcart.wishlist") || "[]");
      localStorage.setItem("fastcart.wishlist", JSON.stringify(ids.filter((item) => item !== id)));
      setProducts((current) => current.filter((item) => item.id !== id));
    } catch {
      setError("Unable to update your wishlist in this browser.");
    }
  }

  async function addToCart(id: number) {
    const token = sessionStorage.getItem("fastcart.customer.token");
    if (!token) {
      navigate("/login");
      return;
    }
    setBusyId(id);
    setMessage("");
    try {
      const response = await fetch(`https://store-api.softclub.tj/Cart/add-product-to-cart?id=${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Unable to add to cart");
      setMessage("Added to cart.");
    } catch {
      setMessage("Unable to add to cart. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <MarketHeader />
      <main className="mx-auto min-h-[720px] max-w-[1170px] px-[20px] py-[70px]">
        <h1 className="mb-[48px] text-[20px] font-[500]">Wishlist ({products.length})</h1>
        {loading && <p>Loading wishlist...</p>}
        {error && <p role="alert" className="text-[#DB4444]">{error}</p>}
        {message && <p role="status" className="mb-[20px] text-[14px]">{message}</p>}
        {!loading && !error && products.length === 0 && (
          <div>
            <p>Your wishlist is empty.</p>
            <Link to="/" className="mt-[16px] inline-block text-[#DB4444] hover:underline">Continue shopping</Link>
          </div>
        )}
        <div className="grid grid-cols-2 gap-[24px] md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <article key={product.id} className="transition-transform duration-300 hover:-translate-y-[4px]">
              <div className="relative flex h-[250px] flex-col overflow-hidden rounded-[4px] bg-[#F5F5F5]">
                <button type="button" aria-label={`Remove ${product.productName} from wishlist`} onClick={() => removeProduct(product.id)} className="absolute right-[12px] top-[12px] flex h-[34px] w-[34px] items-center justify-center rounded-[50%] bg-[#FFFFFF] text-[20px] hover:text-[#DB4444]">×</button>
                <Link to={`/products/${product.id}`} className="flex min-h-0 flex-1 items-center justify-center p-[28px]">
                  {product.images[0] && <img src={`https://store-api.softclub.tj/images/${product.images[0].images}`} alt={product.productName} className="h-full w-full object-contain" />}
                </Link>
                <button type="button" disabled={busyId !== null} onClick={() => addToCart(product.id)} className="h-[40px] bg-[#000000] text-[14px] text-[#FFFFFF] transition-colors hover:bg-[#DB4444] disabled:opacity-50">{busyId === product.id ? "Adding..." : "Add To Cart"}</button>
              </div>
              <Link to={`/products/${product.id}`} className="mt-[14px] block font-[500] hover:text-[#DB4444]">{product.productName}</Link>
              <p className="mt-[8px] text-[#DB4444]">${product.hasDiscount ? product.discountPrice : product.price}</p>
            </article>
          ))}
        </div>
      </main>
      <MarketFooter />
    </>
  );
}

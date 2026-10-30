import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export type MarketProduct = {
  id: number;
  productName: string;
  image: string;
  price: number;
  hasDiscount: boolean;
  discountPrice: number;
};

export default function MarketProductCard({ product }: { product: MarketProduct }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [liked, setLiked] = useState(() => {
    try {
      const saved: number[] = JSON.parse(localStorage.getItem("fastcart.wishlist") || "[]");
      return saved.includes(product.id);
    } catch {
      return false;
    }
  });

  function toggleWishlist() {
    try {
      const saved: number[] = JSON.parse(localStorage.getItem("fastcart.wishlist") || "[]");
      const next = liked ? saved.filter((id) => id !== product.id) : [...saved, product.id];
      localStorage.setItem("fastcart.wishlist", JSON.stringify(next));
      setLiked(!liked);
    } catch {
      setMessage("Unable to save wishlist in this browser.");
    }
  }

  async function addToCart() {
    const token = sessionStorage.getItem("fastcart.customer.token");
    if (!token) {
      navigate("/login");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`https://store-api.softclub.tj/Cart/add-product-to-cart?id=${product.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Unable to add product");
      setMessage("Added to cart");
    } catch {
      setMessage("Unable to add to cart.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="min-w-0 transition-transform duration-300 hover:-translate-y-[4px]">
      <div className="relative flex h-[250px] flex-col overflow-hidden rounded-[4px] bg-[#F5F5F5]">
        {product.hasDiscount && product.price > 0 && (
          <span className="absolute left-[12px] top-[12px] rounded-[4px] bg-[#DB4444] px-[10px] py-[4px] text-[12px] text-[#FFFFFF]">
            -{Math.round((1 - product.discountPrice / product.price) * 100)}%
          </span>
        )}
        <button type="button" onClick={toggleWishlist} aria-label={liked ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={liked} className="absolute right-[12px] top-[12px] z-10 flex h-[34px] w-[34px] items-center justify-center rounded-[50%] bg-[#FFFFFF] text-[20px] hover:text-[#DB4444]">{liked ? "♥" : "♡"}</button>
        <Link to={`/products/${product.id}`} aria-label={`View ${product.productName}`} className="flex min-h-0 flex-1 items-center justify-center p-[28px]">
          <img src={`https://store-api.softclub.tj/images/${product.image}`} alt={product.productName} className="h-full w-full object-contain" />
        </Link>
        <button type="button" disabled={busy} onClick={addToCart} className="h-[40px] bg-[#000000] text-[14px] text-[#FFFFFF] transition-colors hover:bg-[#DB4444] disabled:opacity-50">{busy ? "Adding..." : "Add To Cart"}</button>
      </div>
      <Link to={`/products/${product.id}`} className="mt-[14px] block text-[16px] font-[500] hover:text-[#DB4444]">{product.productName}</Link>
      <p className="mt-[8px] text-[16px] text-[#DB4444]">
        ${product.hasDiscount ? product.discountPrice : product.price}
        {product.hasDiscount && <span className="ml-[10px] text-[#777777] line-through">${product.price}</span>}
      </p>
      {message && <p role="status" className="mt-[6px] text-[12px] text-[#5A607F]">{message}</p>}
    </article>
  );
}

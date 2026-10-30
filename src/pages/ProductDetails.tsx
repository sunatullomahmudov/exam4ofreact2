import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MarketHeader from "../components/MarketHeader";
import MarketFooter from "../components/MarketFooter";

type Product = {
  id: number;
  productName: string;
  description: string;
  price: number;
  hasDiscount: boolean;
  discountPrice: number;
  images: { id: number; images: string }[];
};

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function loadProduct() {
      try {
        const response = await fetch(`https://store-api.softclub.tj/Product/get-product-by-id?id=${encodeURIComponent(id || "")}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Unable to load product");
        const result = await response.json();
        setProduct(result.data);
      } catch {
        if (!controller.signal.aborted) setMessage("Unable to load this product.");
      }
    }
    loadProduct();
    return () => controller.abort();
  }, [id]);

  async function addToCart() {
    const token = sessionStorage.getItem("fastcart.customer.token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await fetch(`https://store-api.softclub.tj/Cart/add-product-to-cart?id=${encodeURIComponent(id || "")}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Unable to add to cart");
      setMessage("Added to cart.");
    } catch {
      setMessage("Unable to add to cart. Please try again.");
    }
  }

  return (
    <>
      <MarketHeader />
      <main className="mx-auto max-w-[1170px] px-[20px] py-[60px]">
        <Link to="/" className="text-[14px] text-[#777777]">Home / Products</Link>
        {message && <p role="status" className="mt-[20px]">{message}</p>}
        {product && (
          <div className="mt-[48px] flex flex-col gap-[40px] md:flex-row">
            <div className="flex min-w-0 flex-1 gap-[16px]">
              <div className="flex flex-col gap-[12px]">
                {product.images.map((image, index) => (
                  <button type="button" key={image.id} onClick={() => setSelectedImage(index)} className="h-[80px] w-[80px] bg-[#F5F5F5] p-[8px]">
                    <img src={`https://store-api.softclub.tj/images/${image.images}`} alt={`View ${index + 1}`} className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
              {product.images[selectedImage] && <img src={`https://store-api.softclub.tj/images/${product.images[selectedImage].images}`} alt={product.productName} className="h-[400px] min-w-0 flex-1 bg-[#F5F5F5] object-contain p-[32px]" />}
            </div>
            <div className="w-full md:w-[380px]">
              <h1 className="text-[24px] font-[700]">{product.productName}</h1>
              <p className="mt-[16px] text-[24px]">${product.hasDiscount ? product.discountPrice : product.price}</p>
              <p className="mt-[24px] border-b border-[#E5E5E5] pb-[24px] text-[14px]">{product.description}</p>
              <button type="button" onClick={addToCart} className="mt-[24px] rounded-[4px] bg-[#DB4444] px-[32px] py-[14px] text-[#FFFFFF]">Add To Cart</button>
            </div>
          </div>
        )}
      </main>
      <MarketFooter />
    </>
  );
}

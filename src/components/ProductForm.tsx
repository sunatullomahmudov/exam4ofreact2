import { useEffect, useRef, useState, type FormEvent } from "react";
import { api } from "../api/client";
import ProductFormFields from "./ProductFormFields";
import { emptyExtras, type ProductExtrasData } from "./productFormData";
import {
  initialProductForm,
  type ProductOption,
} from "./productFormData";

type ProductFormProps = {
  productId: number | null;
  quantity?: number;
  onClose: () => void;
  onSaved: () => void;
};

export default function ProductForm({ productId, quantity, onClose, onSaved }: ProductFormProps) {
  const [form, setForm] = useState(initialProductForm);
  const [extras, setExtras] = useState<ProductExtrasData>(emptyExtras);
  const [brands, setBrands] = useState<ProductOption[]>([]);
  const [colors, setColors] = useState<ProductOption[]>([]);
  const [categories, setCategories] = useState<ProductOption[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [originalDescription, setOriginalDescription] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const previewsRef = useRef<string[]>([]);
  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);
  useEffect(() => () => previewsRef.current.forEach((url) => URL.revokeObjectURL(url)), []);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [brandResponse, colorResponse, categoryResponse, detailResponse] = await Promise.all([
          api.get("/Brand/get-brands", {
            params: { PageNumber: 1, PageSize: 1000 },
          }),
          api.get("/Color/get-colors", {
            params: { PageNumber: 1, PageSize: 1000 },
          }),
          api.get("/SubCategory/get-sub-category"),
          productId === null
            ? Promise.resolve(null)
            : api.get("/Product/get-product-by-id", {
                params: { id: productId },
              }),
        ]);
        if (!active) return;

        const brandItems: ProductOption[] = brandResponse.data.data.map((item: { id: number; brandName: string }) => ({
          id: item.id,
          name: item.brandName,
        }));
        const colorItems: ProductOption[] = colorResponse.data.data.map((item: { id: number; colorName: string }) => ({
          id: item.id,
          name: item.colorName,
        }));
        const categoryItems: ProductOption[] = categoryResponse.data.data.map((item: { id: number; subCategoryName: string }) => ({
          id: item.id,
          name: item.subCategoryName,
        }));
        setBrands(brandItems);
        setColors(colorItems);
        setCategories(categoryItems);

        if (detailResponse) {
          const item = detailResponse.data.data;
          try {
            const stored = localStorage.getItem(`fastcart-product-extras:${item.code}`);
            if (stored) setExtras(JSON.parse(stored));
          } catch {
            setError("Could not load locally saved product options.");
          }
          setOriginalDescription(item.description || "");
          setForm({
            productName: item.productName || "",
            description: item.description || "",
            quantity: String(quantity ?? item.quantity ?? 0),
            code: item.code || "",
            price: String(item.price ?? ""),
            brandId: String(brandItems.find((brand) => brand.name === item.brand)?.id || ""),
            colorId: String(colorItems.find((color) => color.name === item.color)?.id || ""),
            subCategoryId: String(item.subCategoryId || ""),
            weight: item.weight || "",
            size: item.size || "",
            hasDiscount: Boolean(item.hasDiscount),
            discountPrice: String(item.discountPrice ?? ""),
          });
        }
      } catch {
        if (active) setError("Unable to load product fields. Close and try again.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [productId, quantity]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !form.productName.trim() ||
      !form.description.trim() ||
      !form.code.trim() ||
      !form.brandId ||
      !form.colorId ||
      !form.subCategoryId ||
      form.quantity === "" ||
      form.price === "" ||
      !Number.isInteger(Number(form.quantity)) ||
      Number(form.quantity) < 0 ||
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) < 0 ||
      (productId === null && !images.length) ||
      (form.hasDiscount && (form.discountPrice === "" || !Number.isFinite(Number(form.discountPrice)) || Number(form.discountPrice) < 0))
    ) {
      setError("Fill in the required fields and choose an image for a new product.");
      return;
    }
    if (productId !== null && /(?:…|\.\.\.)$/.test(originalDescription.trim()) && form.description === originalDescription) {
      setError("The server returned a shortened description. Enter the full description before saving.");
      return;
    }
    const fields = {
      BrandId: Number(form.brandId),
      ColorId: Number(form.colorId),
      ProductName: form.productName.trim(),
      Description: form.description.trim(),
      Quantity: Number(form.quantity),
      Weight: form.weight,
      Size: form.size,
      Code: form.code.trim(),
      Price: Number(form.price),
      HasDiscount: form.hasDiscount,
      DiscountPrice: form.hasDiscount ? Number(form.discountPrice) : 0,
      SubCategoryId: Number(form.subCategoryId),
    };
    setSaving(true);
    setError("");
    try {
      if (productId === null) {
        const body = new FormData();
        for (const [key, value] of Object.entries(fields)) body.append(key, String(value));
        images.forEach((image) => body.append("Images", image));
        await api.post("/Product/add-product", body);
      } else {
        await api.put("/Product/update-product", null, {
          params: { Id: productId, ...fields },
        });
      }
      try {
        localStorage.setItem(`fastcart-product-extras:${form.code.trim()}`, JSON.stringify(extras));
      } catch {
        setError("Product saved, but browser-only options could not be saved.");
        return;
      }
      onSaved();
    } catch {
      setError("Unable to save the product. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 top-[64px] z-20 overflow-y-auto bg-[#FFFFFF] p-[20px] text-[#1C2536] md:left-[250px] md:p-[28px]">
      <form onSubmit={save} className="mx-auto w-full max-w-[1100px] text-[14px]">
        <div className="mb-[28px] flex items-center justify-between gap-[12px]">
          <h2 className="text-[20px] font-[700]">
            <button type="button" onClick={onClose} aria-label="Back to products" className="mr-[10px] text-[#7E88A8]">←</button>
            Products / {productId === null ? "Add new" : "Edit product"}
          </h2>
          <div className="flex gap-[12px]">
            <button type="button" onClick={onClose} className="h-[40px] rounded-[4px] border border-[#E6E9F4] px-[20px] text-[#2563EB]">Cancel</button>
            <button type="submit" disabled={saving || loading} className="h-[40px] rounded-[4px] bg-[#2563EB] px-[24px] text-[#FFFFFF] disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
          </div>
        </div>
        {error && <p role="alert" className="mb-[16px] text-[#B42318]">{error}</p>}
        {loading ? <p>Loading...</p> : (
          <ProductFormFields
            form={form}
            setForm={setForm}
            brands={brands}
            colors={colors}
            setColors={setColors}
            categories={categories}
            images={images}
            previews={previews}
            setImages={setImages}
            setPreviews={setPreviews}
            productId={productId}
            extras={extras}
            setExtras={setExtras}
          />
        )}
      </form>
    </div>
  );
}

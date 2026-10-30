import { useState, type Dispatch, type SetStateAction } from "react";
import { api } from "../api/client";
import type { ProductFormData, ProductOption } from "./productFormData";
import deleteIcon from "../assets/figma-dashboard/a322e.svg";
import ProductExtras from "./ProductExtras";
import type { ProductExtrasData } from "./productFormData";

type Props = {
  form: ProductFormData;
  setForm: Dispatch<SetStateAction<ProductFormData>>;
  brands: ProductOption[];
  colors: ProductOption[];
  setColors: Dispatch<SetStateAction<ProductOption[]>>;
  categories: ProductOption[];
  images: File[];
  previews: string[];
  setImages: Dispatch<SetStateAction<File[]>>;
  setPreviews: Dispatch<SetStateAction<string[]>>;
  productId: number | null;
  extras: ProductExtrasData;
  setExtras: Dispatch<SetStateAction<ProductExtrasData>>;
};

const input = "h-[44px] w-full rounded-[4px] border border-[#E1E1E1] px-[12px] text-[14px]";

export default function ProductFormFields({
  form, setForm, brands, colors, setColors, categories, images, previews,
  setImages, setPreviews, productId, extras, setExtras,
}: Props) {
  const [colorOpen, setColorOpen] = useState(false);
  const [colorName, setColorName] = useState("");
  const [colorError, setColorError] = useState("");
  const [savingColor, setSavingColor] = useState(false);

  async function createColor() {
    if (!colorName.trim()) return;
    setSavingColor(true);
    setColorError("");
    try {
      await api.post("/Color/add-color", null, { params: { ColorName: colorName.trim() } });
      const response = await api.get("/Color/get-colors", { params: { PageNumber: 1, PageSize: 1000 } });
      const next: ProductOption[] = response.data.data.map((item: { id: number; colorName: string }) => ({ id: item.id, name: item.colorName }));
      setColors(next);
      const created = next.find((item) => item.name === colorName.trim());
      if (created) setForm((current) => ({ ...current, colorId: String(created.id) }));
      setColorOpen(false);
      setColorName("");
    } catch {
      setColorError("Unable to create colour. Please try again.");
    } finally {
      setSavingColor(false);
    }
  }
  function addImages(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files);
    setImages((current) => [...current, ...next]);
    setPreviews((current) => [...current, ...next.map((file) => URL.createObjectURL(file))]);
  }

  function removeImage(index: number) {
    URL.revokeObjectURL(previews[index]);
    setImages((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setPreviews((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="flex flex-col gap-[40px] lg:flex-row">
      <div className="min-w-0 flex-1">
        <h3 className="mb-[16px] text-[14px] font-[700]">Information</h3>
        <div className="flex gap-[16px]">
          <input aria-label="Product name" placeholder="Product name" maxLength={100} value={form.productName} onChange={(event) => setForm({ ...form, productName: event.target.value })} className={input} />
          <input aria-label="Code" placeholder="Code" value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} className={`${input} max-w-[150px]`} />
        </div>
        <textarea aria-label="Description" placeholder="Description" maxLength={500} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-[16px] h-[160px] w-full rounded-[4px] border border-[#E1E1E1] p-[12px] text-[14px]" />
        <div className="mt-[36px] flex gap-[16px]">
          <select aria-label="Categories" value={form.subCategoryId} onChange={(event) => setForm({ ...form, subCategoryId: event.target.value })} className={input}>
            <option value="">Categories</option>
            {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <select aria-label="Brands" value={form.brandId} onChange={(event) => setForm({ ...form, brandId: event.target.value })} className={input}>
            <option value="">Brands</option>
            {brands.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </div>
        <h3 className="mb-[16px] mt-[36px] text-[14px] font-[700]">Price</h3>
        <div className="flex flex-wrap gap-[16px]">
          <input aria-label="Product price" placeholder="Product price" type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className={`${input} min-w-[110px] flex-1`} />
          <input aria-label="Discount price" placeholder="Discount" type="number" min="0" step="0.01" value={form.discountPrice} onChange={(event) => setForm({ ...form, discountPrice: event.target.value, hasDiscount: event.target.value !== "" })} className={`${input} min-w-[110px] flex-1`} />
          <input aria-label="Count" placeholder="Count" type="number" min="0" step="1" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} className={`${input} min-w-[110px] flex-1`} />
        </div>
        <ProductExtras section="options" extras={extras} setExtras={setExtras} />
      </div>
      <div className="w-full lg:w-[340px] lg:shrink-0">
        <section className="rounded-[4px] border border-[#E6E9F4] p-[18px]">
          <div className="mb-[12px] flex items-center justify-between">
            <h3 className="text-[14px] font-[700]">Colour</h3>
            <button type="button" onClick={() => setColorOpen(true)} className="text-[12px] text-[#2563EB]">＋ Create new</button>
          </div>
          <select aria-label="Colour" value={form.colorId} onChange={(event) => setForm({ ...form, colorId: event.target.value })} className={input}>
            <option value="">Select colour</option>
            {colors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </section>
        <ProductExtras section="tags" extras={extras} setExtras={setExtras} />
        <section className="mt-[24px]">
          <h3 className="mb-[12px] text-[14px] font-[700]">Images</h3>
          {productId === null ? (
            <>
              <label onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); addImages(event.dataTransfer.files); }} className="flex h-[120px] cursor-pointer flex-col items-center justify-center rounded-[4px] border border-dashed border-[#B9C5E8] text-center text-[12px] text-[#5A607F]">
                <span className="mb-[8px] text-[20px]">↥</span>
                <span>Click to upload or drag and drop</span>
                <span className="mt-[4px] text-[10px]">SVG, JPG, PNG or GIF</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={(event) => { addImages(event.target.files); event.target.value = ""; }} />
              </label>
              {images.length > 0 && (
                <div className="mt-[12px] rounded-[4px] border border-[#E6E9F4]">
                  <div className="flex justify-between bg-[#F5F6FA] p-[10px] text-[11px] text-[#5A607F]"><span>Image &nbsp;&nbsp; File name</span><span>Action</span></div>
                  {images.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="flex items-center gap-[10px] border-t border-[#E6E9F4] p-[10px]">
                      <img src={previews[index]} alt="" className="h-[40px] w-[40px] rounded-[4px] object-cover" />
                      <span className="min-w-0 flex-1 truncate text-[12px]">{file.name}</span>
                      <button type="button" onClick={() => removeImage(index)} aria-label={`Remove ${file.name}`}><img src={deleteIcon} alt="" /></button>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : <p className="text-[12px] text-[#5A607F]">Images cannot be changed here.</p>}
        </section>
      </div>
      {colorOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#00000080] p-[20px]">
          <div role="dialog" aria-modal="true" aria-labelledby="new-color-title" className="w-full max-w-[480px] rounded-[4px] bg-[#FFFFFF] p-[24px]">
            <h2 id="new-color-title" className="mb-[20px] text-[18px] font-[700]">New color</h2>
            <input aria-label="Color name" placeholder="Color name" value={colorName} onChange={(event) => setColorName(event.target.value)} className={input} />
            {colorError && <p role="alert" className="mt-[8px] text-[12px] text-[#B42318]">{colorError}</p>}
            <div className="mt-[20px] flex justify-end gap-[12px]">
              <button type="button" onClick={() => setColorOpen(false)} className="rounded-[4px] border border-[#E6E9F4] px-[20px] py-[10px] text-[#2563EB]">Cancel</button>
              <button type="button" disabled={savingColor || !colorName.trim()} onClick={createColor} className="rounded-[4px] bg-[#2563EB] px-[20px] py-[10px] text-[#FFFFFF] disabled:opacity-50">{savingColor ? "Creating..." : "Create"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

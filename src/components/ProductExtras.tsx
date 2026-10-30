import { useState, type Dispatch, type SetStateAction } from "react";
import type { ProductExtrasData } from "./productFormData";

type Props = {
  extras: ProductExtrasData;
  setExtras: Dispatch<SetStateAction<ProductExtrasData>>;
  section: "options" | "tags";
};

export default function ProductExtras({ extras, setExtras, section }: Props) {
  const [tag, setTag] = useState("");
  const field = "h-[44px] w-full rounded-[4px] border border-[#E1E1E1] px-[12px] text-[14px]";

  if (section === "tags") {
    return (
      <section className="mt-[24px] rounded-[4px] border border-[#E6E9F4] p-[18px]">
        <h3 className="mb-[12px] text-[14px] font-[700]">Tags</h3>
        <div className="flex gap-[8px]">
          <input aria-label="Tags name" placeholder="Tags name" value={tag} onChange={(event) => setTag(event.target.value)} className={field} />
          <button type="button" aria-label="Add tag" onClick={() => {
            if (!tag.trim()) return;
            setExtras({ ...extras, tags: [...extras.tags, tag.trim()] });
            setTag("");
          }} className="w-[44px] shrink-0 rounded-[4px] border border-[#2563EB] text-[#2563EB]">✓</button>
        </div>
        <div className="mt-[10px] flex flex-wrap gap-[6px]">
          {extras.tags.map((item, index) => (
            <button type="button" key={`${item}-${index}`} aria-label={`Remove tag ${item}`} onClick={() => setExtras({ ...extras, tags: extras.tags.filter((_, i) => i !== index) })} className="rounded-[3px] bg-[#E6E9F4] px-[8px] py-[3px] text-[12px] text-[#5A607F]">{item} ×</button>
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      <label className="mt-[20px] flex items-center gap-[10px] text-[13px]">
        <input type="checkbox" checked={extras.tax} onChange={(event) => setExtras({ ...extras, tax: event.target.checked })} className="accent-[#2563EB]" />
        Add tax for this product
      </label>
      <div className="mt-[48px] flex items-center justify-between rounded-[4px] border border-[#E1E1E1] p-[14px]">
        <div>
          <h3 className="text-[14px] font-[700]">Different Options</h3>
          <p className="text-[12px] text-[#7E7E7E]">This product has multiple options</p>
        </div>
        <input type="checkbox" aria-label="Different options" checked={extras.multiple} onChange={(event) => setExtras({ ...extras, multiple: event.target.checked })} className="h-[18px] w-[18px] accent-[#2563EB]" />
      </div>
      {extras.multiple && (
        <section className="mt-[36px]">
          <h3 className="mb-[14px] text-[14px] font-[700]">Options</h3>
          {extras.options.map((option, index) => (
            <div key={index} className="mb-[12px] flex gap-[16px]">
              <input aria-label={`Option ${index + 1}`} placeholder={`Option ${index + 1}`} value={option.name} onChange={(event) => setExtras({ ...extras, options: extras.options.map((item, i) => i === index ? { ...item, name: event.target.value } : item) })} className={field} />
              <input aria-label={`Values for option ${index + 1}`} placeholder="Value" value={option.values} onChange={(event) => setExtras({ ...extras, options: extras.options.map((item, i) => i === index ? { ...item, values: event.target.value } : item) })} className={field} />
              <button type="button" aria-label={`Remove option ${index + 1}`} onClick={() => setExtras({ ...extras, options: extras.options.filter((_, i) => i !== index) })} className="text-[#7E88A8]">×</button>
            </div>
          ))}
          <button type="button" onClick={() => setExtras({ ...extras, options: [...extras.options, { name: "", values: "" }] })} className="text-[12px] text-[#2563EB]">＋ Add more</button>
        </section>
      )}
      <p className="mt-[16px] text-[12px] text-[#5A607F]">Tax, tags and extra options are saved in this browser only.</p>
    </>
  );
}

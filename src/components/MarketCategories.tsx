import { useEffect, useState } from "react";

type Category = { id: number; categoryName: string };
type Props = { selected: number | null; onSelect: (id: number | null) => void };
const categoryOrder = ["Woman's Fashion", "Men's Fashion", "Electronic", "Home & Lifestyle", "Medicine", "Sports & Outdoor", "Baby’s & Toys", "Groceries & Pets", "Health & Beauty"];

export default function MarketCategories({ selected, onSelect }: Props) {
  const [items, setItems] = useState<Category[]>([]);
  const [error, setError] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("https://store-api.softclub.tj/Category/get-categories", { signal: controller.signal });
        if (!response.ok) throw new Error("Categories unavailable");
        const result = await response.json();
        const categories: Category[] = result.data;
        const ordered = categoryOrder.flatMap((name) => categories.filter((item) => item.categoryName === name));
        setItems([...ordered, ...categories.filter((item) => !categoryOrder.includes(item.categoryName))]);
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
    }
    load();
    return () => controller.abort();
  }, []);

  return (
    <aside className="w-full border-b border-[#E5E5E5] pt-[28px] md:w-[220px] md:shrink-0 md:border-b-0 md:border-r md:pr-[20px]">
      <nav aria-label="Product categories" className="flex flex-wrap gap-[6px] md:flex-col">
        <button type="button" onClick={() => onSelect(null)} className={selected === null ? "py-[6px] text-left text-[14px] text-[#DB4444]" : "py-[6px] text-left text-[14px] hover:text-[#DB4444]"}>All products</button>
        {(showAll ? items : items.slice(0, 9)).map((item) => (
          <button type="button" key={item.id} onClick={() => onSelect(item.id)} className={selected === item.id ? "py-[6px] text-left text-[14px] text-[#DB4444]" : "py-[6px] text-left text-[14px] transition-colors hover:text-[#DB4444]"}>
            {item.categoryName}
          </button>
        ))}
        {items.length > 9 && <button type="button" onClick={() => setShowAll(!showAll)} className="py-[6px] text-left text-[12px] text-[#777777] hover:text-[#DB4444]">{showAll ? "Show less" : "More categories"}</button>}
        {error && <p className="text-[12px] text-[#DB4444]">Categories unavailable.</p>}
      </nav>
    </aside>
  );
}

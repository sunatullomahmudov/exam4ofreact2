import leftIcon from "../assets/figma-dashboard/1b3da.svg";
import rightIcon from "../assets/figma-dashboard/93c8c.svg";

type PaginationProps = {
  page: number;
  count: number;
  total: number;
  onChange: (page: number) => void;
};

export default function Pagination({ page, count, total, onChange }: PaginationProps) {
  if (count < 1) return null;
  const pages: (number | string)[] = [];
  for (let n = 1; n <= count; n++) {
    if (n === 1 || n === count || Math.abs(n - page) <= 2) pages.push(n);
    else if (pages[pages.length - 1] !== "...") pages.push("...");
  }
  return (
    <nav aria-label="Pagination" className="mt-[24px] flex flex-wrap items-center gap-[4px] text-[14px] text-[#5A607F]">
      <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => onChange(page - 1)} className="mr-[12px] flex h-[36px] w-[36px] items-center justify-center disabled:opacity-40">
        <img src={leftIcon} alt="" />
      </button>
      {pages.map((item, index) =>
        typeof item === "number" ? (
          <button type="button" key={item} aria-current={item === page ? "page" : undefined} onClick={() => onChange(item)} className={item === page ? "h-[36px] min-w-[36px] rounded-[4px] bg-[#E8EDFF] text-[#2563EB]" : "h-[36px] min-w-[36px]"}>
            {item}
          </button>
        ) : (
          <span key={`dots-${index}`} className="px-[8px]">
            …
          </span>
        ),
      )}
      <button type="button" aria-label="Next page" disabled={page >= count} onClick={() => onChange(page + 1)} className="ml-[12px] flex h-[36px] w-[36px] items-center justify-center disabled:opacity-40">
        <img src={rightIcon} alt="" />
      </button>
      <span className="ml-auto">{total} Results</span>
    </nav>
  );
}

import { useEffect, useState } from "react";

type BannerItem = {
  title: string;
  image: File | null;
  preview: string;
};

const emptyBanner: BannerItem = { title: "", image: null, preview: "" };

export default function BannerSettings() {
  const [mainSlider, setMainSlider] = useState<BannerItem>(emptyBanner);
  const [banner, setBanner] = useState<BannerItem>(emptyBanner);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    return () => {
      if (mainSlider.preview) URL.revokeObjectURL(mainSlider.preview);
      if (banner.preview) URL.revokeObjectURL(banner.preview);
    };
  }, [mainSlider.preview, banner.preview]);

  function changeImage(
    file: File | null,
    current: BannerItem,
    setItem: (item: BannerItem) => void,
  ) {
    if (!file) return;
    if (current.preview) URL.revokeObjectURL(current.preview);
    setItem({ ...current, image: file, preview: URL.createObjectURL(file) });
    setSaved(false);
  }

  function renderSection(
    label: string,
    item: BannerItem,
    setItem: (item: BannerItem) => void,
  ) {
    return (
      <section className="flex-1">
        <h2 className="mb-[12px] text-[14px] font-[700]">{label}</h2>
        <label className="flex h-[120px] cursor-pointer flex-col items-center justify-center rounded-[4px] border border-dashed border-[#B9C5E8] text-[12px] text-[#5A607F]">
          {item.preview ? (
            <img
              src={item.preview}
              alt="Selected banner"
              className="h-full w-full object-contain"
            />
          ) : (
            <>
              <span className="mb-[8px] text-[20px]">↥</span>
              Click to upload or drag and drop
              <span className="mt-[4px] text-[10px]">SVG, JPG, PNG or gif</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(event) =>
              changeImage(event.target.files?.[0] || null, item, setItem)
            }
            className="hidden"
          />
        </label>
        <label className="mt-[12px] block text-[12px]">
          Title
          <input
            value={item.title}
            onChange={(event) => {
              setItem({ ...item, title: event.target.value });
              setSaved(false);
            }}
            className="mt-[4px] h-[40px] w-full rounded-[4px] border border-[#E1E1E1] px-[12px]"
          />
        </label>
      </section>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-[24px] lg:flex-row">
        {renderSection("Main sliders", mainSlider, setMainSlider)}
        {renderSection("Banner", banner, setBanner)}
      </div>
      <button
        type="button"
        onClick={() => setSaved(true)}
        className="mt-[20px] ml-auto block h-[36px] rounded-[4px] bg-[#2563EB] px-[20px] text-[12px] text-[#FFFFFF]"
      >
        Save
      </button>
      {saved && (
        <p className="mt-[10px] text-right text-[12px] text-[#00A76F]">
          Banner draft saved for this session.
        </p>
      )}
    </div>
  );
}

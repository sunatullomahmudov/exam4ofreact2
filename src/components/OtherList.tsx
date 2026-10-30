import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOtherItems } from "../store/otherSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { api } from "../api/client";
import BannerSettings from "./BannerSettings";
import DeleteDialog from "./DeleteDialog";
import deleteIcon from "../assets/figma-dashboard/a322e.svg";

type OtherListProps = {
  kind: "categories" | "brands" | "banners";
};

export default function OtherList({ kind }: OtherListProps) {
  const dispatch = useAppDispatch();
  const { items, totalPage, isLoading, error } = useAppSelector(
    (state) => state.other,
  );
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const navigate = useNavigate();
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    if (kind === "banners") return;
    dispatch(getOtherItems({ kind, page }));
  }, [dispatch, kind, page]);

  async function saveItem() {
    if (!name.trim() || kind === "banners") return;
    setSaving(true);
    try {
      if (kind === "brands") {
        await api.post("/Brand/add-brand", null, {
          params: { BrandName: name.trim() },
        });
      } else if (image) {
        const body = new FormData();
        body.append("CategoryName", name.trim());
        body.append("CategoryImage", image);
        await api.post("/Category/add-category", body);
      }
      setFormOpen(false);
      setName("");
      setImage(null);
      dispatch(getOtherItems({ kind, page }));
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(id: number) {
    if (kind === "banners") return;
    setActionError("");
    try {
      await api.delete(
        kind === "brands" ? "/Brand/delete-brand" : "/Category/delete-category",
        {
          params: { id },
        },
      );
      dispatch(getOtherItems({ kind, page }));
    } catch {
      setActionError("Unable to delete this item. Please try again.");
    }
  }

  return (
    <section className="relative">
      <div className="mb-[40px] flex items-center gap-[8px] text-[14px]">
        <button
          type="button"
          onClick={() => navigate("/categories")}
          className={
            kind === "categories"
              ? "rounded-[4px] bg-[#E5EDFF] px-[16px] py-[12px] text-[#2563EB]"
              : "px-[16px] py-[12px]"
          }
        >
          Categories
        </button>
        <button
          type="button"
          onClick={() => navigate("/brands")}
          className={
            kind === "brands"
              ? "rounded-[4px] bg-[#E5EDFF] px-[16px] py-[12px] text-[#2563EB]"
              : "px-[16px] py-[12px]"
          }
        >
          Brands
        </button>
        <button
          type="button"
          onClick={() => navigate("/banners")}
          className={
            kind === "banners"
              ? "rounded-[4px] bg-[#E5EDFF] px-[16px] py-[12px] text-[#2563EB]"
              : "px-[16px] py-[12px]"
          }
        >
          Banners
        </button>
        {kind === "categories" && (
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="ml-auto h-[40px] rounded-[4px] bg-[#2563EB] px-[16px] text-[#FFFFFF]"
          >
            ＋ Add new
          </button>
        )}
      </div>

      {kind === "banners" && <BannerSettings />}

      {kind !== "banners" && (
        <input
          type="search"
          aria-label={`Search ${kind}`}
          placeholder="Search..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="mb-[24px] h-[56px] w-full max-w-[248px] rounded-[4px] border border-[#E6E9F4] px-[16px] text-[14px]"
        />
      )}

      {isLoading && <p className="text-[14px] text-[#6B7280]">Loading...</p>}
      {kind !== "banners" && error && (
        <div>
          <p role="alert" className="text-[14px] text-[#B42318]">
            {error}
          </p>
          <button
            type="button"
            onClick={() => dispatch(getOtherItems({ kind, page }))}
            className="mt-[12px] rounded-[4px] border border-[#E5E7EB] px-[12px] py-[8px] text-[14px]"
          >
            Retry
          </button>
        </div>
      )}

      {kind !== "banners" && !isLoading && !error && (
        <>
          {actionError && (
            <p role="alert" className="mb-[12px] text-[14px] text-[#B42318]">
              {actionError}
            </p>
          )}
          <ul
            className={
              kind === "brands"
                ? "max-w-[620px] border-t border-[#E6E9F4]"
                : "grid grid-cols-2 gap-[16px] md:grid-cols-3 xl:grid-cols-5"
            }
          >
            {filteredItems.map((item) => (
              <li
                key={item.id}
                className={
                  kind === "brands"
                    ? "flex h-[48px] items-center justify-between border-b border-[#E6E9F4] px-[12px] text-[12px]"
                    : "flex min-h-[144px] flex-col justify-between rounded-[4px] border border-[#D9D9D9] p-[18px] text-[14px]"
                }
              >
                {kind !== "brands" && item.image ? (
                  <img
                    src={`https://store-api.softclub.tj/images/${item.image}`}
                    alt=""
                    className="h-[48px] w-[48px] object-contain"
                  />
                ) : kind !== "brands" ? (
                  <span className="h-[48px]" />
                ) : null}
                <span>{item.name}</span>
                <span className="flex items-center gap-[14px]">
                  <button
                    type="button"
                    onClick={() => setDeleteId(item.id)}
                    aria-label={`Delete ${item.name}`}
                    className="flex h-[24px] w-[24px] items-center justify-center"
                  >
                    <img src={deleteIcon} alt="" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
          {filteredItems.length === 0 && (
            <p className="text-[14px] text-[#6B7280]">No {kind} found.</p>
          )}
        </>
      )}

      {kind === "brands" && (
        <aside className="mt-[24px] w-full rounded-[4px] border border-[#E6E9F4] p-[16px] lg:absolute lg:left-[650px] lg:top-[82px] lg:mt-0 lg:w-[310px]">
          <h2 className="mb-[16px] text-[14px] font-[700]">Add new brand</h2>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Brand name"
            className="h-[40px] w-full rounded-[4px] border border-[#E6E9F4] px-[12px] text-[12px]"
          />
          <button
            type="button"
            disabled={saving || !name.trim()}
            onClick={saveItem}
            className="mt-[16px] ml-auto block h-[36px] rounded-[4px] bg-[#2563EB] px-[20px] text-[12px] text-[#FFFFFF] disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create"}
          </button>
        </aside>
      )}

      {kind === "brands" && !isLoading && !error && totalPage > 1 && (
        <div className="mt-[20px] flex items-center gap-[16px] text-[14px]">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="rounded-[4px] border border-[#E5E7EB] px-[12px] py-[8px] disabled:opacity-40"
          >
            Previous
          </button>
          <span>
            {page} / {totalPage}
          </span>
          <button
            type="button"
            disabled={page >= totalPage}
            onClick={() => setPage(page + 1)}
            className="rounded-[4px] border border-[#E5E7EB] px-[12px] py-[8px] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
      {formOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-[#00000080] p-[20px]">
          <div className="w-full max-w-[420px] rounded-[4px] bg-[#FFFFFF] p-[24px]">
            <h2 className="text-[20px] font-[700]">
              Add {kind === "brands" ? "brand" : "category"}
            </h2>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={`${kind === "brands" ? "Brand" : "Category"} name`}
              className="mt-[20px] h-[44px] w-full rounded-[4px] border border-[#E1E1E1] px-[12px]"
            />
            {kind === "categories" && (
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setImage(event.target.files?.[0] || null)}
                className="mt-[12px] w-full"
              />
            )}
            <div className="mt-[20px] flex justify-end gap-[12px]">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-[4px] border border-[#E1E1E1] px-[16px] py-[10px]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={saveItem}
                className="rounded-[4px] bg-[#2563EB] px-[16px] py-[10px] text-[#FFFFFF]"
              >
                {saving ? "Saving..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteId !== null && (
        <DeleteDialog
          title={`Delete ${kind === "brands" ? "brand" : "category"}`}
          message="Are you sure you want to delete this item?"
          onCancel={() => setDeleteId(null)}
          onDelete={async () => {
            await deleteItem(deleteId);
            setDeleteId(null);
          }}
        />
      )}
    </section>
  );
}

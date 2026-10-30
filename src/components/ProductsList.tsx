import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { deleteProduct, getProducts } from "../store/productsSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import DeleteDialog from "./DeleteDialog";
import Pagination from "./Pagination";
import ProductForm from "./ProductForm";
import searchIcon from "../assets/figma-dashboard/ae5fc.svg";
import editIcon from "../assets/figma-dashboard/8eae2.svg";
import deleteIcon from "../assets/figma-dashboard/a322e.svg";
import toolbarDeleteIcon from "../assets/figma-dashboard/e11a5.svg";
import basketIcon from "../assets/figma-dashboard/57e67.svg";

export default function ProductsList() {
  const dispatch = useAppDispatch();
  const { items, totalPage, totalRecord, isLoading, error } = useAppSelector((state) => state.products);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState<number[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [deleteIds, setDeleteIds] = useState<number[]>([]);
  const [deleteError, setDeleteError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const search = searchParams.get("search") || "";
  const pageValue = Number(searchParams.get("page"));
  const page = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1;

  useEffect(() => {
    dispatch(getProducts({ page, search }));
  }, [dispatch, page, search]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get("search") || "").trim();
    setSelected([]);
    setSearchParams(value ? { search: value } : {});
  }

  function changePage(nextPage: number) {
    setSelected([]);
    setSearchParams(search ? { search, page: String(nextPage) } : { page: String(nextPage) });
  }

  async function confirmDelete() {
    setDeleting(true);
    setDeleteError("");
    const failed: number[] = [];

    for (const id of deleteIds) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
      } catch {
        failed.push(id);
      }
    }

    setDeleting(false);
    setSelected(failed);
    await dispatch(getProducts({ page, search }));

    if (failed.length) {
      setDeleteIds(failed);
      setDeleteError("Some products could not be deleted. Please try again.");
    } else {
      setDeleteIds([]);
      if (items.length === deleteIds.length && page > 1) changePage(page - 1);
    }
  }

  const allSelected = items.length > 0 && items.every((product) => selected.includes(product.id));

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="mb-[40px] flex items-center justify-between">
        <h1 className="text-[24px] font-[700]">Products</h1>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setFormOpen(true);
          }}
          className="h-[40px] rounded-[4px] bg-[#2563EB] px-[16px] text-[14px] text-[#FFFFFF]"
        >
          ＋ Add product
        </button>
      </div>

      {isLoading && <p className="text-[14px] text-[#6B7280]">Loading products...</p>}

      {error && (
        <div>
          <p role="alert" className="text-[14px] text-[#B42318]">
            {error}
          </p>
          <button type="button" onClick={() => dispatch(getProducts({ page, search }))} className="mt-[12px] rounded-[4px] border border-[#E5E7EB] px-[12px] py-[8px] text-[14px]">
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && totalRecord === 0 && !search ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-auto text-center">
          <div className="mb-[20px] flex h-[140px] w-[140px] items-center justify-center">
            <img src={basketIcon} alt="" />
          </div>
          <h2 className="text-[20px] font-[700]">Add new products</h2>
          <p className="mt-[8px] text-[16px] text-[#5A607F]">
            Start making sales by adding your products.
            <br />
            You can import and manage your products at any time.
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setFormOpen(true);
            }}
            className="mt-[24px] h-[40px] rounded-[4px] bg-[#2563EB] px-[24px] text-[#FFFFFF]"
          >
            ＋ Add product
          </button>
        </div>
      ) : !isLoading && !error ? (
        <>
          <div className="mb-[24px] flex flex-wrap items-center gap-[12px]">
            <form onSubmit={handleSearch} className="relative">
              <input key={search} name="search" type="search" aria-label="Search products" placeholder="Search..." defaultValue={search} className="h-[56px] w-[250px] rounded-[4px] border border-[#E1E1E1] pl-[16px] pr-[40px] text-[14px]" />
              <button type="submit" aria-label="Submit search" className="absolute right-[16px] top-[18px]">
                <img src={searchIcon} alt="" />
              </button>
            </form>
            <button
              type="button"
              disabled={selected.length === 0}
              aria-label="Delete selected products"
              onClick={() => {
                setDeleteIds(selected);
                setDeleteError("");
              }}
              className="ml-auto flex h-[40px] w-[40px] items-center justify-center rounded-[4px] border border-[#E6E9F4] disabled:opacity-40"
            >
              <img src={toolbarDeleteIcon} alt="" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-auto">
            <table className="w-full min-w-[740px] text-left text-[14px]">
              <thead className="sticky top-0 z-10 bg-[#FFFFFF] text-[#5A607F]">
                <tr>
                  <th className="w-[40px] p-[8px]">
                    <input type="checkbox" className="h-[20px] w-[20px] accent-[#2563EB]" aria-label="Select all products on this page" checked={allSelected} onChange={(event) => setSelected(event.target.checked ? items.map((item) => item.id) : [])} />
                  </th>
                  <th className="py-[12px] font-[400]">Product</th>
                  <th className="py-[12px] font-[400]">Inventory</th>
                  <th className="py-[12px] font-[400]">Category</th>
                  <th className="py-[12px] font-[400]">Price</th>
                  <th className="py-[12px] font-[400]">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((product) => (
                  <tr key={product.id} className={selected.includes(product.id) ? "border-t border-[#E6E9F4] bg-[#F8F8F8]" : "border-t border-[#E6E9F4]"}>
                    <td className="p-[8px]">
                      <input
                        type="checkbox"
                        className="h-[20px] w-[20px] accent-[#2563EB]"
                        aria-label={`Select ${product.productName}`}
                        checked={selected.includes(product.id)}
                        onChange={(event) => setSelected(event.target.checked ? [...selected, product.id] : selected.filter((id) => id !== product.id))}
                      />
                    </td>
                    <td className="py-[12px]">
                      <span className="flex items-center gap-[16px]">
                        <img src={`https://store-api.softclub.tj/images/${product.image}`} alt="" className="h-[48px] w-[48px] rounded-[4px] object-cover" />
                        {product.productName}
                      </span>
                    </td>
                    <td className="py-[12px]">{product.quantity > 0 ? `${product.quantity} in stock` : <span className="rounded-[4px] bg-[#E6E9F4] px-[8px] py-[4px] text-[#5A607F]">Out of Stock</span>}</td>
                    <td className="py-[12px]">{product.categoryName}</td>
                    <td className="py-[12px]">{product.price}</td>
                    <td className="py-[12px]">
                      <span className="flex items-center gap-[16px]">
                        <button
                          type="button"
                          aria-label={`Edit ${product.productName}`}
                          onClick={() => {
                            setEditingId(product.id);
                            setFormOpen(true);
                          }}
                        >
                          <img src={editIcon} alt="" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${product.productName}`}
                          onClick={() => {
                            setDeleteIds([product.id]);
                            setDeleteError("");
                          }}
                        >
                          <img src={deleteIcon} alt="" />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {items.length === 0 && <p className="py-[24px] text-[14px] text-[#6B7280]">No products found.</p>}
          <Pagination page={page} count={totalPage} total={totalRecord} onChange={changePage} />
        </>
      ) : null}

      {formOpen && (
        <ProductForm
          productId={editingId}
          quantity={items.find((item) => item.id === editingId)?.quantity}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            dispatch(getProducts({ page, search }));
          }}
        />
      )}
      {deleteIds.length > 0 && (
        <DeleteDialog
          title={deleteIds.length === 1 ? "Delete product" : "Delete Items"}
          message={deleteIds.length === 1 ? "Are you sure you want to delete this product?" : `Are you sure you want to delete ${deleteIds.length} selected items?`}
          busy={deleting}
          error={deleteError}
          onCancel={() => setDeleteIds([])}
          onDelete={confirmDelete}
        />
      )}
    </section>
  );
}

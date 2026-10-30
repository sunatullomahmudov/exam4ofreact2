import { useState, type FormEvent } from "react";
import searchIcon from "../assets/figma-dashboard/ae5fc.svg";
import editIcon from "../assets/figma-dashboard/184af.svg";
import deleteIcon from "../assets/figma-dashboard/e11a5.svg";
import receiptIcon from "../assets/figma-dashboard/6fd78.svg";
import DeleteDialog from "./DeleteDialog";
import Pagination from "./Pagination";
import { demoOrders, emptyOrder, orderStorageKey, type Order } from "./ordersData";
export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(orderStorageKey);
      return saved ? JSON.parse(saved) : demoOrders;
    } catch {
      return demoOrders;
    }
  });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<Order>(emptyOrder);
  const [formError, setFormError] = useState("");
  const [storageError, setStorageError] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const filtered = orders.filter((order) => `${order.id} ${order.customer}`.toLowerCase().includes(search.toLowerCase()));
  if (sort === "oldest") filtered.reverse();
  const pageSize = 11;
  const pageCount = Math.ceil(filtered.length / pageSize);
  const currentOrders = filtered.slice((page - 1) * pageSize, page * pageSize);
  function saveOrders(next: Order[]) {
    setOrders(next);
    try {
      localStorage.setItem(orderStorageKey, JSON.stringify(next));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }

  function openAdd() {
    setForm(emptyOrder);
    setFormError("");
    setFormOpen(true);
  }

  function openEdit() {
    if (selected.length !== 1) return;
    const order = orders.find((item) => item.key === selected[0]);
    if (order) {
      setForm(order);
      setFormError("");
      setFormOpen(true);
    }
  }

  function saveOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.id.trim() || !form.customer.trim() || !form.date.trim() || form.total.trim() === "" || !Number.isFinite(Number(form.total)) || Number(form.total) < 0) {
      setFormError("Fill in all fields and enter a valid total.");
      return;
    }
    if (form.key) {
      saveOrders(orders.map((order) => (order.key === form.key ? { ...form, total: Number(form.total).toFixed(2) } : order)));
    } else {
      saveOrders([
        {
          ...form,
          key: crypto.randomUUID(),
          total: Number(form.total).toFixed(2),
        },
        ...orders,
      ]);
      setPage(1);
    }
    setSelected([]);
    setFormOpen(false);
  }

  function deleteOrders() {
    if (!selected.length) return;
    const next = orders.filter((order) => !selected.includes(order.key));
    saveOrders(next);
    setSelected([]);
    setPage(1);
    setDeleteOpen(false);
  }

  return (
    <section>
      <div className="mb-[40px] flex items-center justify-between gap-[12px]">
        <div className="flex items-center gap-[12px]">
          <h1 className="text-[24px] font-[700]">Orders</h1>
          <span className="rounded-[4px] bg-[#E8EDFF] px-[8px] py-[4px] text-[12px] text-[#2563EB]">Demo</span>
        </div>
        {orders.length > 0 && (
          <button type="button" onClick={openAdd} className="h-[40px] rounded-[4px] bg-[#2563EB] px-[16px] text-[14px] text-[#FFFFFF]">
            ＋ Add order
          </button>
        )}
      </div>
      <p className="mb-[16px] text-[12px] text-[#5A607F]">Demo orders are saved only in this browser.</p>
      {storageError && (
        <p role="alert" className="mb-[16px] text-[14px] text-[#B42318]">
          Unable to save demo orders in this browser. Changes will be lost after reloading.
        </p>
      )}
      {orders.length === 0 ? (
        <div className="flex min-h-[500px] flex-col items-center justify-center text-center">
          <div className="mb-[20px] flex h-[140px] w-[140px] items-center justify-center">
            <img src={receiptIcon} alt="" />
          </div>
          <h2 className="text-[20px] font-[700]">No Orders Yet</h2>
          <p className="mt-[8px] text-[16px] text-[#5A607F]">
            All the upcoming orders from your store will be visible in this page.
            <br />
            You can add orders by yourself if you sell offline.
          </p>
          <button type="button" onClick={openAdd} className="mt-[24px] h-[40px] rounded-[4px] bg-[#2563EB] px-[24px] text-[14px] text-[#FFFFFF]">
            ＋ Add order
          </button>
        </div>
      ) : (
        <>
          <div className="mb-[24px] flex flex-wrap items-center gap-[12px]">
            <div className="relative">
              <input
                type="search"
                aria-label="Search demo orders"
                placeholder="Search..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="h-[56px] w-[250px] rounded-[4px] border border-[#E1E1E1] pl-[16px] pr-[40px] text-[14px]"
              />
              <img src={searchIcon} alt="" className="absolute right-[16px] top-[18px]" />
            </div>
            <label className="relative text-[12px] text-[#7E7E7E]">
              <span className="absolute left-[12px] top-[-8px] bg-[#FFFFFF] px-[4px]">Filter</span>
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  setPage(1);
                }}
                className="h-[56px] w-[150px] rounded-[4px] border border-[#E1E1E1] px-[16px] text-[14px] text-[#1C2536]"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </label>
            <div className="ml-auto flex gap-[12px]">
              <button type="button" aria-label="Edit selected demo order" disabled={selected.length !== 1} onClick={openEdit} className="flex h-[40px] w-[40px] items-center justify-center rounded-[4px] border border-[#E6E9F4] disabled:opacity-40">
                <img src={editIcon} alt="" />
              </button>
              <button type="button" aria-label="Delete selected demo orders" disabled={!selected.length} onClick={() => setDeleteOpen(true)} className="flex h-[40px] w-[40px] items-center justify-center rounded-[4px] border border-[#E6E9F4] disabled:opacity-40">
                <img src={deleteIcon} alt="" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[740px] text-left text-[14px]">
              <thead className="text-[#5A607F]">
                <tr>
                  <th className="w-[40px] p-[8px]">
                    <input
                      type="checkbox"
                      className="h-[20px] w-[20px] accent-[#2563EB]"
                      aria-label="Select all orders on this page"
                      checked={currentOrders.length > 0 && currentOrders.every((order) => selected.includes(order.key))}
                      onChange={(event) => setSelected(event.target.checked ? [...new Set([...selected, ...currentOrders.map((order) => order.key)])] : selected.filter((key) => !currentOrders.some((order) => order.key === key)))}
                    />
                  </th>
                  <th className="py-[12px] font-[400]">Order</th>
                  <th className="py-[12px] font-[400]">Date</th>
                  <th className="py-[12px] font-[400]">Customer</th>
                  <th className="py-[12px] font-[400]">Payment status</th>
                  <th className="py-[12px] font-[400]">Order Status</th>
                  <th className="py-[12px] font-[400]">Total</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.key} className={selected.includes(order.key) ? "border-t border-[#E6E9F4] bg-[#F8F8F8]" : "border-t border-[#E6E9F4]"}>
                    <td className="p-[8px]">
                      <input
                        type="checkbox"
                        className="h-[20px] w-[20px] accent-[#2563EB]"
                        aria-label={`Select order ${order.id} ${order.customer}`}
                        checked={selected.includes(order.key)}
                        onChange={(event) => setSelected(event.target.checked ? [...selected, order.key] : selected.filter((key) => key !== order.key))}
                      />
                    </td>
                    <td className="py-[16px] font-[500]">{order.id}</td>
                    <td className="py-[16px]">{order.date}</td>
                    <td className="py-[16px]">{order.customer}</td>
                    <td className="py-[16px]">
                      <span className={order.payment === "Paid" ? "rounded-[4px] bg-[#C5F8E3] px-[8px] py-[4px] text-[#00A76F]" : "rounded-[4px] bg-[#E6E9F4] px-[8px] py-[4px] text-[#5A607F]"}>{order.payment}</span>
                    </td>
                    <td className="py-[16px]">
                      <span className={order.status === "Ready" ? "rounded-[4px] bg-[#FF9500] px-[8px] py-[4px] text-[#FFFFFF]" : order.status === "Shipped" ? "rounded-[4px] bg-[#5A607F] px-[8px] py-[4px] text-[#FFFFFF]" : "rounded-[4px] bg-[#2563EB] px-[8px] py-[4px] text-[#FFFFFF]"}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-[16px]">${order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <p className="py-[24px] text-[14px] text-[#5A607F]">No matching orders.</p>}
          <Pagination page={page} count={pageCount} total={filtered.length} onChange={setPage} />
        </>
      )}
      {deleteOpen && <DeleteDialog title="Delete Items" message={`Are you sure you want to delete ${selected.length} selected item${selected.length === 1 ? "" : "s"}?`} onCancel={() => setDeleteOpen(false)} onDelete={deleteOrders} />}
      {formOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-[#00000080] p-[20px]">
          <form onSubmit={saveOrder} className="flex w-full max-w-[440px] flex-col gap-[12px] rounded-[4px] bg-[#FFFFFF] p-[24px]">
            <h2 className="text-[20px] font-[700]">{form.key ? "Edit demo order" : "Add demo order"}</h2>
            <label className="text-[14px]">
              Order number
              <input value={form.id} onChange={(event) => setForm({ ...form, id: event.target.value })} className="mt-[4px] h-[40px] w-full rounded-[4px] border border-[#D7DBEC] px-[12px]" />
            </label>
            <label className="text-[14px]">
              Customer
              <input value={form.customer} onChange={(event) => setForm({ ...form, customer: event.target.value })} className="mt-[4px] h-[40px] w-full rounded-[4px] border border-[#D7DBEC] px-[12px]" />
            </label>
            <label className="text-[14px]">
              Date
              <input value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} placeholder="May 5, 4:20 PM" className="mt-[4px] h-[40px] w-full rounded-[4px] border border-[#D7DBEC] px-[12px]" />
            </label>
            <label className="text-[14px]">
              Total
              <input type="number" min="0" step="0.01" value={form.total} onChange={(event) => setForm({ ...form, total: event.target.value })} className="mt-[4px] h-[40px] w-full rounded-[4px] border border-[#D7DBEC] px-[12px]" />
            </label>
            <label className="text-[14px]">
              Payment status
              <select
                value={form.payment}
                onChange={(event) =>
                  setForm({
                    ...form,
                    payment: event.target.value as Order["payment"],
                  })
                }
                className="mt-[4px] h-[40px] w-full rounded-[4px] border border-[#D7DBEC] px-[12px]"
              >
                <option>Paid</option>
                <option>Pending</option>
              </select>
            </label>
            <label className="text-[14px]">
              Order status
              <select
                value={form.status}
                onChange={(event) =>
                  setForm({
                    ...form,
                    status: event.target.value as Order["status"],
                  })
                }
                className="mt-[4px] h-[40px] w-full rounded-[4px] border border-[#D7DBEC] px-[12px]"
              >
                <option>Ready</option>
                <option>Shipped</option>
                <option>Received</option>
              </select>
            </label>
            {formError && (
              <p role="alert" className="text-[14px] text-[#B42318]">
                {formError}
              </p>
            )}
            <div className="mt-[8px] flex justify-end gap-[12px]">
              <button type="button" onClick={() => setFormOpen(false)} className="rounded-[4px] border border-[#D7DBEC] px-[16px] py-[8px]">
                Cancel
              </button>
              <button type="submit" className="rounded-[4px] bg-[#2563EB] px-[16px] py-[8px] text-[#FFFFFF]">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

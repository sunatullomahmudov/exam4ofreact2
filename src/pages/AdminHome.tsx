import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import logo from "../assets/fastcart-logo.svg";
import healthcare from "../assets/figma-dashboard/c8089.png";
import hoodie from "../assets/figma-dashboard/9203a.png";
import stripedShirt from "../assets/figma-dashboard/b4ffe.png";
import whiteShirt from "../assets/figma-dashboard/e8fa8.png";
import mensShirt from "../assets/figma-dashboard/17d41.png";
import redShirt from "../assets/figma-dashboard/b98db.png";
import homeIcon from "../assets/figma-dashboard/d75f5.svg";
import listIcon from "../assets/figma-dashboard/dce01.svg";
import tagIcon from "../assets/figma-dashboard/c0ae1.svg";
import folderIcon from "../assets/figma-dashboard/43bc7.svg";
import searchIcon from "../assets/figma-dashboard/154b9.svg";
import bellIcon from "../assets/figma-dashboard/adee8.svg";
import salesIcon from "../assets/figma-dashboard/sales.png";
import costIcon from "../assets/figma-dashboard/cost.png";
import profitIcon from "../assets/figma-dashboard/profit.png";
import selectedHomeIcon from "../assets/figma-dashboard/e36a1.svg";
import selectedListIcon from "../assets/figma-dashboard/d8503.svg";
import selectedFolderIcon from "../assets/figma-dashboard/d9366.svg";
import graphLine from "../assets/figma-dashboard/addba.svg";
import graphPoint from "../assets/figma-dashboard/b8806.svg";
import graphTooltip from "../assets/figma-dashboard/b9738.svg";
import arrowIcon from "../assets/figma-dashboard/c865d.svg";
import ProductsList from "../components/ProductsList";
import OrdersList from "../components/OrdersList";
import OtherList from "../components/OtherList";

const transactions = [
  {
    name: "Jagarnath S.",
    date: "24.05.2023",
    amount: "$124.97",
    status: "Paid",
  },
  { name: "Anand G.", date: "23.05.2023", amount: "$55.42", status: "Pending" },
  { name: "Kartik S.", date: "23.05.2023", amount: "$89.90", status: "Paid" },
  {
    name: "Rakesh S.",
    date: "22.05.2023",
    amount: "$144.94",
    status: "Pending",
  },
  { name: "Anup S.", date: "22.05.2023", amount: "$70.52", status: "Paid" },
  { name: "Jimmy P.", date: "22.05.2023", amount: "$70.52", status: "Paid" },
];

const topProducts = [
  { name: "Men Grey Hoodie", price: "$49.90", units: 204, image: hoodie },
  {
    name: "Women Striped T-Shirt",
    price: "$34.90",
    units: 155,
    image: stripedShirt,
  },
  {
    name: "Women White T-Shirt",
    price: "$40.90",
    units: 120,
    image: whiteShirt,
  },
  { name: "Men White T-Shirt", price: "$49.90", units: 204, image: mensShirt },
  { name: "Women Red T-Shirt", price: "$34.90", units: 155, image: redShirt },
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function AdminHome() {
  const dispatch = useAppDispatch();
  const userName = useAppSelector((state) => state.auth.userName);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if (event.ctrlKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  }

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[#FFFFFF] text-[#1C2536]">
      <header className="flex h-[64px] shrink-0 items-center bg-[#1C2536] px-[28px] text-[#FFFFFF]">
        <img src={logo} alt="Fastcart" className="w-[100px] md:w-[166px]" />
        <form
          onSubmit={handleSearch}
          className="ml-[16px] flex items-center gap-[8px] md:ml-[100px]"
        >
          <img src={searchIcon} alt="" className="h-[18px] w-[18px] " />
          <input
            ref={searchRef}
            type="search"
            aria-label="Search products"
            placeholder="Search..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-[80px] bg-[#1C2536] text-[14px] text-[#FFFFFF] outline-none placeholder:text-[#D1D5DB] md:w-[200px]"
          />
        </form>
        <div className="relative ml-auto flex items-center gap-[16px]">
          <img
            src={bellIcon}
            alt="Notifications"
            className="hidden h-[18px] w-[18px]  sm:block"
          />
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            aria-expanded={profileOpen}
            className="flex cursor-pointer items-center gap-[8px] text-[14px]"
          >
            <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[50%] bg-[#10B981] font-[700]">
              S
            </span>
            <span className="hidden sm:block">{userName}</span>
            <span>⌄</span>
          </button>
          {profileOpen && (
            <button
              type="button"
              onClick={() => dispatch(logout())}
              className="absolute right-0 top-[42px] z-10 w-[120px] rounded-[4px] border border-[#E5E7EB] bg-[#FFFFFF] p-[12px] text-left text-[#1C2536]"
            >
              Log out
            </button>
          )}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <aside className="shrink-0 overflow-y-auto bg-[#1C2536] px-[16px] py-[36px] text-[14px] text-[#FFFFFF] md:w-[250px] md:shrink-0">
          <nav
            aria-label="Admin navigation"
            className="flex flex-wrap gap-[8px] md:flex-col"
          >
            <button
              type="button"
              onClick={() => navigate("/")}
              aria-current={pathname === "/" ? "page" : undefined}
              className={
                pathname === "/"
                  ? "flex cursor-pointer items-center gap-[16px] rounded-[4px] bg-[#FFFFFF] px-[16px] py-[12px] text-left text-[#1C2536]"
                  : "flex cursor-pointer items-center gap-[16px] px-[16px] py-[12px] text-left text-[#D1D5DB]"
              }
            >
              <img
                src={pathname === "/" ? selectedHomeIcon : homeIcon}
                alt=""
                className="h-[20px] w-[20px]"
              />
              Dashboard
            </button>
            <button
              type="button"
              onClick={() => navigate("/orders")}
              aria-current={pathname === "/orders" ? "page" : undefined}
              className={
                pathname === "/orders"
                  ? "flex cursor-pointer items-center gap-[16px] rounded-[4px] bg-[#FFFFFF] px-[16px] py-[12px] text-left text-[#1C2536]"
                  : "flex cursor-pointer items-center gap-[16px] px-[16px] py-[12px] text-left text-[#D1D5DB]"
              }
            >
              <img
                src={pathname === "/orders" ? selectedListIcon : listIcon}
                alt=""
                className="h-[20px] w-[20px]"
              />
              Orders
            </button>
            <button
              type="button"
              onClick={() => navigate("/products")}
              aria-current={pathname === "/products" ? "page" : undefined}
              className={
                pathname === "/products"
                  ? "flex cursor-pointer items-center gap-[16px] rounded-[4px] bg-[#FFFFFF] px-[16px] py-[12px] text-left text-[#1C2536]"
                  : "flex cursor-pointer items-center gap-[16px] px-[16px] py-[12px] text-left text-[#D1D5DB]"
              }
            >
              <img
                src={tagIcon}
                alt=""
                className={
                  pathname === "/products"
                    ? "h-[20px] w-[20px] brightness-0"
                    : "h-[20px] w-[20px]"
                }
              />
              Products
            </button>
            <button
              type="button"
              onClick={() => navigate("/categories")}
              aria-current={
                pathname === "/categories" ||
                pathname === "/brands" ||
                pathname === "/banners"
                  ? "page"
                  : undefined
              }
              className={
                pathname === "/categories" ||
                pathname === "/brands" ||
                pathname === "/banners"
                  ? "flex cursor-pointer items-center gap-[16px] rounded-[4px] bg-[#FFFFFF] px-[16px] py-[12px] text-left text-[#5A607F]"
                  : "flex cursor-pointer items-center gap-[16px] px-[16px] py-[12px] text-left text-[#D1D5DB]"
              }
            >
              <img
                src={
                  pathname === "/categories" ||
                  pathname === "/brands" ||
                  pathname === "/banners"
                    ? selectedFolderIcon
                    : folderIcon
                }
                alt=""
                className="h-[20px] w-[20px]"
              />
              Other
            </button>
          </nav>
        </aside>

        <main
          className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-y-auto p-[20px] md:p-[28px]"
        >
          {pathname === "/products" ? (
            <ProductsList />
          ) : pathname === "/orders" ? (
            <OrdersList />
          ) : pathname === "/categories" ? (
            <OtherList key="categories" kind="categories" />
          ) : pathname === "/brands" ? (
            <OtherList key="brands" kind="brands" />
          ) : pathname === "/banners" ? (
            <OtherList key="banners" kind="banners" />
          ) : (
            <>
              <div className="mb-[24px] flex items-center gap-[12px]">
                <h1 className="text-[24px] font-[700]">Dashboard</h1>
                <span className="rounded-[4px] bg-[#E8EDFF] px-[8px] py-[4px] text-[12px] text-[#2563EB]">
                  Demo
                </span>
              </div>
              <div className="flex flex-col gap-[16px] lg:flex-row">
                <div className="flex min-w-0 flex-1 flex-col gap-[16px]">
                  <div className="flex flex-col gap-[12px] sm:flex-row">
                    <div className="flex flex-1 items-center gap-[16px] rounded-[4px] bg-[#FEF3F2] px-[24px] py-[16px]">
                      <img
                        src={salesIcon}
                        alt=""
                        className="h-[48px] w-[48px] object-contain"
                      />
                      <div>
                        <p className="text-[14px] text-[#6B7280]">Sales</p>
                        <p className="text-[24px] font-[700]">$152k</p>
                      </div>
                    </div>
                    <div className="flex flex-1 items-center gap-[16px] rounded-[4px] bg-[#FFFAEB] px-[24px] py-[16px]">
                      <img
                        src={costIcon}
                        alt=""
                        className="h-[48px] w-[48px] object-contain"
                      />
                      <div>
                        <p className="text-[14px] text-[#6B7280]">Cost</p>
                        <p className="text-[24px] font-[700]">$99.7k</p>
                      </div>
                    </div>
                    <div className="flex flex-1 items-center gap-[16px] rounded-[4px] bg-[#F0FDF9] px-[24px] py-[16px]">
                      <img
                        src={profitIcon}
                        alt=""
                        className="h-[48px] w-[48px] object-contain"
                      />
                      <div>
                        <p className="text-[14px] text-[#6B7280]">Profit</p>
                        <p className="text-[24px] font-[700]">$32.1k</p>
                      </div>
                    </div>
                  </div>

                  <section className="rounded-[4px] border border-[#E5E7EB] p-[20px]">
                    <h2 className="text-[16px] font-[700]">Sales Revenue</h2>
                    <div className="relative mt-[20px] flex h-[230px] gap-[12px]">
                      <div className="flex h-full flex-col justify-between pb-[20px] text-[12px] text-[#9CA3AF]">
                        <span>50</span>
                        <span>40</span>
                        <span>30</span>
                        <span>20</span>
                        <span>10</span>
                        <span>0</span>
                      </div>
                      <div className="relative flex-1">
                        <div className="flex h-[205px] flex-col justify-between">
                          <span className="border-t border-[#F3F4F6]" />
                          <span className="border-t border-[#F3F4F6]" />
                          <span className="border-t border-[#F3F4F6]" />
                          <span className="border-t border-[#F3F4F6]" />
                          <span className="border-t border-[#F3F4F6]" />
                          <span className="border-t border-[#F3F4F6]" />
                        </div>
                        <img
                          src={graphLine}
                          alt="Demo sales revenue chart"
                          className="absolute left-0 top-0 h-[205px] w-full"
                        />
                        <div className="mt-[6px] flex justify-between text-[10px] text-[#9CA3AF]">
                          {months.map((month) => (
                            <span key={month}>{month}</span>
                          ))}
                        </div>
                        <div className="absolute left-[34%] top-[4px] h-[62px] w-[122px] text-center text-[10px] text-[#FFFFFF]">
                          <img
                            src={graphTooltip}
                            alt=""
                            className="absolute inset-0"
                          />
                          <span className="relative top-[10px]">
                            <b>864 Orders</b>
                            <br />
                            May
                          </span>
                        </div>
                        <img
                          src={graphPoint}
                          alt=""
                          className="absolute left-[44%] top-[68px]"
                        />
                      </div>
                    </div>
                  </section>
                </div>

                <section className="rounded-[4px] border border-[#E5E7EB] p-[16px] lg:w-[310px] lg:shrink-0">
                  <div className="mb-[16px] flex items-center justify-between gap-[8px]">
                    <h2 className="text-[14px] font-[700]">
                      Top selling products
                    </h2>
                    <button
                      type="button"
                      onClick={() => navigate("/products")}
                      className="cursor-pointer text-[12px]"
                    >
                      See All <img src={arrowIcon} alt="" className="inline" />
                    </button>
                  </div>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-[10px] py-[8px]"
                    >
                      <img
                        src={healthcare}
                        alt="Healthcare Erbology"
                        className="h-[52px] w-[52px] rounded-[4px] object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-[500]">
                          Healthcare Erbology
                        </p>
                        <p className="text-[12px] text-[#9CA3AF]">
                          In Accessories
                        </p>
                      </div>
                      <div className="text-right text-[12px]">
                        <p className="text-[#10B981]">13,153</p>
                        <p className="text-[#9CA3AF]">in sales</p>
                      </div>
                    </div>
                  ))}
                </section>
              </div>

              <div className="mt-[24px] flex flex-col gap-[16px] lg:flex-row">
                <section className="min-w-0 flex-1 rounded-[4px] border border-[#E5E7EB] p-[20px]">
                  <h2 className="mb-[16px] text-[16px] font-[700]">
                    Recent Transactions
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[420px] text-left text-[12px]">
                      <thead className="text-[#9CA3AF]">
                        <tr>
                          <th className="pb-[12px] font-[400]">Name</th>
                          <th className="pb-[12px] font-[400]">Date</th>
                          <th className="pb-[12px] font-[400]">Amount</th>
                          <th className="pb-[12px] font-[400]">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((transaction) => (
                          <tr key={transaction.name}>
                            <td className="py-[10px]">{transaction.name}</td>
                            <td className="py-[10px]">{transaction.date}</td>
                            <td className="py-[10px]">{transaction.amount}</td>
                            <td className="py-[10px]">
                              <span
                                className={
                                  transaction.status === "Paid"
                                    ? "rounded-[4px] bg-[#C9F5E1] px-[10px] py-[4px] text-[#11A66B]"
                                    : "rounded-[4px] bg-[#E7EAF2] px-[10px] py-[4px] text-[#67758C]"
                                }
                              >
                                {transaction.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
                <section className="min-w-0 flex-1 rounded-[4px] border border-[#E5E7EB] p-[20px]">
                  <h2 className="mb-[16px] text-[16px] font-[700]">
                    Top Products by Units Sold
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[350px] text-left text-[12px]">
                      <thead className="text-[#9CA3AF]">
                        <tr>
                          <th className="pb-[12px] font-[400]">Name</th>
                          <th className="pb-[12px] font-[400]">Price</th>
                          <th className="pb-[12px] text-right font-[400]">
                            Units
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {topProducts.map((product) => (
                          <tr key={product.name}>
                            <td className="py-[6px]">
                              <span className="flex items-center gap-[10px]">
                                <img
                                  src={product.image}
                                  alt=""
                                  className="h-[36px] w-[36px] rounded-[4px] object-cover"
                                />
                                {product.name}
                              </span>
                            </td>
                            <td className="py-[6px]">{product.price}</td>
                            <td className="py-[6px] text-right">
                              {product.units}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

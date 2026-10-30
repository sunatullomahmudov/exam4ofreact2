import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/fastcart-logo.svg";

export default function MarketHeader() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(search.trim() ? `/?search=${encodeURIComponent(search.trim())}` : "/");
  }

  return (
      <header className="border-b border-[#E5E5E5]">
        <nav className="mx-auto flex min-h-[88px] max-w-[1170px] flex-wrap items-center justify-between gap-[20px] px-[20px] py-[16px]">
          <Link to="/" aria-label="Fastcart home">
            <img src={logo} alt="Fastcart" className="w-[140px] brightness-0" />
          </Link>
          <div className="flex items-center gap-[28px] text-[14px]">
            <Link to="/" className="hover:text-[#DB4444]">Home</Link>
            <span>Contact</span>
            <span>About</span>
            <Link to="/signup" className="hover:text-[#DB4444]">Sign Up</Link>
          </div>
          <form onSubmit={handleSearch} className="flex items-center rounded-[4px] bg-[#F5F5F5] px-[12px]">
            <input aria-label="Search products" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="What are you looking for?" className="h-[40px] w-[190px] bg-transparent text-[12px] outline-none" />
            <button type="submit" aria-label="Search" className="text-[18px]">⌕</button>
          </form>
          <Link to="/wishlist" aria-label="Wishlist" className="text-[24px] transition-colors hover:text-[#DB4444]">♡</Link>
        </nav>
      </header>
  );
}

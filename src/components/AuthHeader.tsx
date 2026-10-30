import { Link } from "react-router-dom";
import logo from "../assets/fastcart-logo.svg";

export default function AuthHeader() {
  return (
    <header className="border-b border-[#E5E5E5] bg-[#FFFFFF]">
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
        <div className="hidden rounded-[4px] bg-[#F5F5F5] px-[16px] py-[10px] text-[12px] text-[#777777] md:block">
          What are you looking for?
        </div>
      </nav>
    </header>
  );
}

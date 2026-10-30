import { Link } from "react-router-dom";

export default function MarketFooter() {
  return (
    <footer className="bg-[#000000] px-[20px] pt-[70px] text-[#FFFFFF]">
      <div className="mx-auto flex max-w-[1170px] flex-wrap justify-between gap-[36px] pb-[60px]">
        <div>
          <h2 className="text-[24px] font-[700]">Exclusive</h2>
          <p className="mt-[20px] text-[18px]">Subscribe</p>
          <p className="mt-[16px] text-[14px]">Get 10% off your first order</p>
          <div className="mt-[16px] flex h-[44px] w-[210px] items-center rounded-[4px] border border-[#FFFFFF] px-[12px]">
            <input aria-label="Email for subscription" type="email" placeholder="Enter your email" disabled className="min-w-0 flex-1 bg-transparent text-[12px] outline-none" />
            <span aria-hidden="true">➤</span>
          </div>
        </div>
        <div>
          <h2 className="text-[18px] font-[500]">Support</h2>
          <p className="mt-[20px] text-[14px]">111 Bijoy sarani, Dhaka,<br />DH 1515, Bangladesh.</p>
          <p className="mt-[12px] text-[14px]">exclusive@gmail.com</p>
          <p className="mt-[12px] text-[14px]">+88015-88888-9999</p>
        </div>
        <div className="flex flex-col gap-[12px] text-[14px]">
          <h2 className="mb-[8px] text-[18px] font-[500]">Account</h2>
          <span>My Account</span>
          <Link to="/login" className="transition-colors hover:text-[#DB4444]">Login / Register</Link>
          <span>Cart</span>
          <Link to="/wishlist" className="transition-colors hover:text-[#DB4444]">Wishlist</Link>
          <span>Shop</span>
        </div>
        <div className="text-[14px]">
          <h2 className="mb-[20px] text-[18px] font-[500]">Quick Link</h2>
          <p className="mb-[12px]">Privacy Policy</p>
          <p className="mb-[12px]">Terms Of Use</p>
          <p className="mb-[12px]">FAQ</p>
          <p>Contact</p>
        </div>
      </div>
      <p className="border-t border-[#333333] py-[18px] text-center text-[12px] text-[#777777]">© Copyright Exclusive. All rights reserved.</p>
    </footer>
  );
}

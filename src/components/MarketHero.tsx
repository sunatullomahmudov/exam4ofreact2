import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import phoneBanner from "../assets/phone-banner-1.png";
import phoneBanner2 from "../assets/phone-banner-2.png";
import phoneBanner3 from "../assets/phone-banner-3.png";
import phoneBanner4 from "../assets/phone-banner-4.png";

const banners = [phoneBanner, phoneBanner2, phoneBanner3, phoneBanner4];

export default function MarketHero() {
  return (
    <section className="min-w-0 flex-1 pt-[40px]">
      <Swiper
        modules={[Autoplay, Pagination]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
      >
        {banners.map((banner) => (
        <SwiperSlide key={banner}>
          <div className="relative flex min-h-[300px] items-center overflow-hidden bg-[#000000] text-[#FFFFFF] md:min-h-[344px]">
            <img src={banner} alt="Purple smartphone" className="absolute inset-0 h-full w-full object-cover" />
            <div className="relative z-10 max-w-[360px] p-[32px] md:p-[48px]">
              <p className="mb-[18px] text-[16px]">iPhone 14 Series</p>
              <h2 className="text-[34px] font-[700] md:text-[48px]">Up to 10%<br />off Voucher</h2>
              <a href="#products" className="mt-[22px] inline-block border-b border-[#FFFFFF] pb-[4px]">Shop Now →</a>
            </div>
          </div>
        </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

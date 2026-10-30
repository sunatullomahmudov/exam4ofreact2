import type { ReactNode } from "react";
import logo from "../assets/fastcart-logo.svg";
import background from "../assets/login-background.svg";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen flex-col bg-[#FFFFFF] md:flex-row">
      <section className="flex min-h-[250px] items-center justify-center bg-[#1C2536] bg-cover bg-center px-[24px] text-[#FFFFFF] md:min-h-screen md:w-[53%] md:justify-start md:px-[64px]" style={{ backgroundImage: `url(${background})` }}>
        <div className="auth-entry w-full max-w-[350px]">
          <p className="mb-[8px] text-[16px]">Welcome to admin panel</p>
          <img src={logo} alt="Fastcart" className="w-full" />
        </div>
      </section>

      <section className="flex flex-1 justify-center px-[24px] py-[64px] md:pt-[210px]">
        <div className="auth-entry w-full max-w-[400px]">{children}</div>
      </section>
    </main>
  );
}

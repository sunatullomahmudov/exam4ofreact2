import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import MarketFooter from "../components/MarketFooter";

type LoginFields = {
  userName: string;
  password: string;
};

export default function CustomerLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFields>();

  async function login(values: LoginFields) {
    setError("");
    try {
      const response = await fetch("https://store-api.softclub.tj/Account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Login failed");
      const result: { data?: unknown } = await response.json();
      if (typeof result.data !== "string" || !result.data) throw new Error("Invalid token");
      sessionStorage.setItem("fastcart.customer.token", result.data);
      sessionStorage.setItem("fastcart.customer.user", values.userName);
      navigate("/");
    } catch {
      setError("Unable to log in. Check your username and password and try again.");
    }
  }

  return (
    <>
    <AuthHeader />
    <main className="flex min-h-[850px] items-center justify-center px-[20px] py-[70px] text-[#000000] lg:min-h-[1040px]">
      <form onSubmit={handleSubmit(login)} className="flex w-full max-w-[370px] flex-col gap-[16px]">
        <div>
          <h1 className="text-[32px] font-[500]">Log in to Exclusive</h1>
          <p className="mb-[20px] mt-[12px] text-[14px]">Enter your details below</p>
        </div>
        <label>
          <span className="sr-only">Username</span>
          <input placeholder="Email or phone number" autoComplete="username" {...register("userName", { required: "Enter your username." })} className="h-[48px] w-full rounded-[4px] border border-[#D1D1D1] px-[12px] outline-none focus:border-[#DB4444]" />
          {errors.userName && <span role="alert" className="text-[12px] text-[#DB4444]">{errors.userName.message}</span>}
        </label>
        <label>
          <span className="sr-only">Password</span>
          <span className="flex items-center rounded-[4px] border border-[#D1D1D1] focus-within:border-[#DB4444]">
            <input type={showPassword ? "text" : "password"} placeholder="Password" autoComplete="current-password" {...register("password", { required: "Enter your password." })} className="h-[48px] min-w-0 flex-1 px-[12px] outline-none" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="px-[12px] text-[12px] text-[#777777]">{showPassword ? "Hide" : "Show"}</button>
          </span>
          {errors.password && <span role="alert" className="text-[12px] text-[#DB4444]">{errors.password.message}</span>}
        </label>
        {error && <p role="alert" className="text-[14px] text-[#DB4444]">{error}</p>}
        <p className="text-center text-[12px] text-[#DB4444]">Forgot Password?</p>
        <button type="submit" disabled={isSubmitting} className="h-[56px] rounded-[4px] bg-[#DB4444] px-[32px] text-[#FFFFFF] transition-colors hover:bg-[#B83232] disabled:opacity-50">
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
        <p className="text-center text-[14px] text-[#777777]">Don't have an account? <Link to="/signup" className="border-b border-[#777777] text-[#000000] hover:text-[#DB4444]">Sign up</Link></p>
      </form>
    </main>
    <MarketFooter />
    </>
  );
}

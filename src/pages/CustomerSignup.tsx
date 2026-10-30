import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import MarketFooter from "../components/MarketFooter";

type SignupFields = {
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};

export default function CustomerSignup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const { register, handleSubmit, getValues, trigger, formState: { errors, isSubmitting } } = useForm<SignupFields>();
  const input = "h-[48px] w-full rounded-[4px] border border-[#D1D1D1] px-[12px] outline-none transition-colors focus:border-[#DB4444]";

  async function signup(values: SignupFields) {
    setError("");
    try {
      const response = await fetch("https://store-api.softclub.tj/Account/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Registration failed");
      const login = await fetch("https://store-api.softclub.tj/Account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: values.userName, password: values.password }),
      });
      if (!login.ok) {
        navigate("/login", { state: { registered: true } });
        return;
      }
      const result: { data?: unknown } = await login.json();
      if (typeof result.data !== "string" || !result.data) throw new Error("Invalid token");
      sessionStorage.setItem("fastcart.customer.token", result.data);
      sessionStorage.setItem("fastcart.customer.user", values.userName);
      navigate("/");
    } catch {
      setError("Unable to create account. Please check your details and try again.");
    }
  }

  return (
    <>
      <AuthHeader />
      <main className="flex min-h-[850px] items-center justify-center px-[20px] py-[70px] lg:min-h-[1040px]">
        <form onSubmit={handleSubmit(signup)} className="flex w-full max-w-[370px] flex-col gap-[16px]">
          <h1 className="text-[36px] font-[500]">Create an account</h1>
          <p className="mb-[18px] text-[16px]">Enter your details below</p>
          <div className={step === 1 ? "flex flex-col gap-[16px]" : "hidden"}>
            <input aria-label="Name" placeholder="Name" autoComplete="username" {...register("userName", { required: true })} className={input} />
            <input aria-label="Email" placeholder="Email or phone number" type="email" autoComplete="email" {...register("email", { required: true })} className={input} />
            <input aria-label="Password" placeholder="Password" type="password" autoComplete="new-password" {...register("password", { required: true })} className={input} />
          </div>
          {step === 2 && (
            <>
              <input aria-label="Phone number" placeholder="Phone number" type="tel" autoComplete="tel" {...register("phoneNumber", { required: true })} className={input} />
              <input aria-label="Confirm password" placeholder="Confirm password" type="password" autoComplete="new-password" {...register("confirmPassword", { required: true, validate: (value) => value === getValues("password") })} className={input} />
            </>
          )}
          {Object.keys(errors).length > 0 && <p role="alert" className="text-[13px] text-[#DB4444]">Complete all fields and make sure the passwords match.</p>}
          {error && <p role="alert" className="text-[13px] text-[#DB4444]">{error}</p>}
          {step === 1 ? (
            <button type="button" onClick={async () => { if (await trigger(["userName", "email", "password"])) setStep(2); }} className="mt-[18px] h-[56px] rounded-[4px] bg-[#DB4444] text-[#FFFFFF] transition-colors hover:bg-[#B83232]">Create Account</button>
          ) : (
            <button type="submit" disabled={isSubmitting} className="mt-[18px] h-[56px] rounded-[4px] bg-[#DB4444] text-[#FFFFFF] transition-colors hover:bg-[#B83232] disabled:opacity-50">{isSubmitting ? "Creating..." : "Create Account"}</button>
          )}
          {step === 2 && <button type="button" onClick={() => setStep(1)} className="text-[14px] text-[#777777]">Back</button>}
          {step === 1 && <button type="button" disabled title="Google sign up is not available" className="rounded-[4px] border border-[#D1D1D1] py-[14px] text-center text-[14px] text-[#777777]">Sign up with Google</button>}
          <p className="mt-[14px] text-center text-[14px] text-[#777777]">Already have account? <Link to="/login" className="ml-[8px] border-b border-[#777777] text-[#000000] transition-colors hover:text-[#DB4444]">Log in</Link></p>
        </form>
      </main>
      <MarketFooter />
    </>
  );
}

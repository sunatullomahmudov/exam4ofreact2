import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function ForgotPassword() {
  const [showMessage, setShowMessage] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShowMessage(true);
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
        <Link to="/login" className="text-[14px] text-[#555E6B]">
          ← Log in
        </Link>
        <h1 className="text-[24px] font-[700] text-[#111827]">Forgot password</h1>
        <label>
          <span className="sr-only">Email</span>
          <input type="email" placeholder="Email" autoComplete="email" required className="h-[56px] w-full rounded-[4px] border border-[#E5E7EB] px-[16px] text-[16px]" onChange={() => setShowMessage(false)} />
        </label>
        <button type="submit" className="h-[52px] w-full cursor-pointer rounded-[4px] bg-[#2563EB] text-[16px] font-[700] text-[#FFFFFF]">
          Send reset link
        </button>
        {showMessage && (
          <p role="status" className="text-[14px] text-[#B42318]">
            Password recovery is not available yet. Please contact your administrator for help.
          </p>
        )}
      </form>
    </AuthLayout>
  );
}

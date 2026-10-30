import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { clearError, login } from "../store/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.auth);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await dispatch(login({ userName: userName.trim(), password })).unwrap();
      navigate("/", { replace: true });
    } catch {}
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
        <h1 className="text-[24px] font-[700] text-[#111827]">Log in</h1>

        <label>
          <span className="sr-only">Username</span>
          <input
            className="h-[56px] w-full rounded-[4px] border border-[#E5E7EB] px-[16px] text-[16px]"
            type="text"
            placeholder="Username"
            autoComplete="username"
            value={userName}
            required
            onChange={(event) => {
              setUserName(event.target.value);
              if (error) dispatch(clearError());
            }}
          />
        </label>

        <div className="relative">
          <label>
            <span className="sr-only">Password</span>
            <input
              className="h-[56px] w-full rounded-[4px] border border-[#E5E7EB] pl-[16px] pr-[70px] text-[16px]"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              required
              onChange={(event) => {
                setPassword(event.target.value);
                if (error) dispatch(clearError());
              }}
            />
          </label>
          <button className="absolute right-[16px] top-[16px] cursor-pointer text-[14px] text-[#6B7280]" type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {error && (
          <p role="alert" className="text-[14px] text-[#B42318]">
            {error}
          </p>
        )}

        <Link to="/forgot-password" className="text-center text-[14px] text-[#2563EB]">
          Forgot password?
        </Link>

        <button className="h-[52px] w-full cursor-pointer rounded-[4px] bg-[#2563EB] text-[16px] font-[700] text-[#FFFFFF] disabled:opacity-60" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Logging in…" : "Log in"}
        </button>
      </form>
    </AuthLayout>
  );
}

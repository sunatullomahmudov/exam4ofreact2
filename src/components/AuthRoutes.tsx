import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout, tokenExpiration, tokenIsCurrent } from "../store/authSlice";

export function Layout() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) return;
    const expiration = tokenExpiration(token);
    if (!expiration) {
      dispatch(logout());
      return;
    }
    const checkSession = () => {
      if (Date.now() >= expiration) dispatch(logout());
    };
    checkSession();
    const timer = window.setInterval(checkSession, 1000);
    return () => window.clearInterval(timer);
  }, [dispatch, token]);

  return <Outlet />;
}

export function ProtectedRoute() {
  const token = useAppSelector((state) => state.auth.token);
  const location = useLocation();
  return token && tokenIsCurrent(token) ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}

export function PublicRoute() {
  const token = useAppSelector((state) => state.auth.token);
  return token && tokenIsCurrent(token) ? <Navigate to="/" replace /> : <Outlet />;
}

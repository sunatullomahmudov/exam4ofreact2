import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import AdminHome from "./pages/AdminHome";
import { Layout, ProtectedRoute, PublicRoute } from "./components/AuthRoutes";

export default function App() {
  return (
    <RouterProvider
      router={createBrowserRouter([
        {
          path: "/",
          element: <Layout />,
          children: [
            {
              element: <PublicRoute />,
              children: [
                { path: "login", element: <Login /> },
                { path: "forgot-password", element: <ForgotPassword /> },
              ],
            },
            {
              element: <ProtectedRoute />,
              children: [
                { index: true, element: <AdminHome /> },
                { path: "orders", element: <AdminHome /> },
                { path: "products", element: <AdminHome /> },
                { path: "categories", element: <AdminHome /> },
                { path: "brands", element: <AdminHome /> },
                { path: "banners", element: <AdminHome /> },
              ],
            },
          ],
        },
      ])}
    />
  );
}

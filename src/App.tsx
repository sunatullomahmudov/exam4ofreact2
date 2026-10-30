import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerHome from "./pages/CustomerHome";
import ProductDetails from "./pages/ProductDetails";
import CustomerSignup from "./pages/CustomerSignup";
import Wishlist from "./pages/Wishlist";

function CustomerStart() {
  if (!sessionStorage.getItem("fastcart.customer.token")) {
    return <Navigate to="/signup" replace />;
  }
  return <CustomerHome />;
}

export default function App() {
  return (
    <RouterProvider
      router={createBrowserRouter([
        { path: "/", element: <CustomerStart /> },
        { path: "/login", element: <CustomerLogin /> },
        { path: "/signup", element: <CustomerSignup /> },
        { path: "/products/:id", element: <ProductDetails /> },
        { path: "/wishlist", element: <Wishlist /> },
      ])}
    />
  );
}

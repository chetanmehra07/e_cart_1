import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ProductDetails from "../../features/catalog/ProductDetails";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import BasketPage from "../../features/basket/BasketPage";
import LoginPage from "../../features/login/LoginPage";
import UserProfilePage from "../../features/userprofile/UserProfile";
import RegisterPage from "../../features/resister/RegisterPage";
import CheckoutPage from "../../features/checkout/CheckOutPage";
import AddressPage from "../../features/address/AddressPage";
import AddAddressPage from "../../features/address/AddAddressPage";
import OrderPage from "../../features/orders/OrdersPage";
import BuyHistoryPage from "../../features/buyhistory/BuyHistory";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "/catalog", element: <Catalog /> },
      { path: "/catalog/:id", element: <ProductDetails /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/basket", element: <BasketPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/profile", element: <UserProfilePage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/address", element: <AddressPage /> },
      { path: "/add-address", element: <AddAddressPage /> },
      { path: "/orders", element: <OrderPage /> },
      { path: "/buyhistory", element: <BuyHistoryPage /> },
    ],
  },
]);

import {
  AppBar,
  Badge,
  Box,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { DarkMode, LightMode, ShoppingCart } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../store/store";
import { setDarkMode } from "./uiSlice";
import { useFetchBasketQuery } from "../api/apiSlice";
import { getGuestCart } from "../../features/basket/localCart";
import { useEffect, useState } from "react";

const midLinks = [
  { title: "catalog", path: "/catalog" },
  { title: "about", path: "/about" },
  { title: "contact", path: "/contact" },
];
const rightLinks = [
  { title: "login", path: "/login" },
  { title: "register", path: "/register" },
];

const navStyles = {
  color: "inherit",
  typography: "h6",
  fontWeight: 500,
  textDecoration: "none",
  transition: "all 0.1s ease-in-out",
  "&:hover": {
    color: "secondary.main",
    transform: "scale(0.96)",
  },
  "&.active": { color: "secondary.main" },
};

export default function NavBar() {
  const dispatch = useAppDispatch();
  const { darkMode, isLoading } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.account);
  const { data: basketItems } = useFetchBasketQuery(user ? user.loginid : 0, {
    skip: !user,
  });
  const [guestCount, setGuestCount] = useState(
    getGuestCart().reduce((total, item) => total + item.item_count, 0)
  );
  useEffect(() => {
    const syncGuestCart = () => {
      const newCount = getGuestCart().reduce(
        (total, item) => total + item.item_count,
        0
      );
      setGuestCount(newCount);
    };

    window.addEventListener("storage", syncGuestCart);
    const interval = setInterval(syncGuestCart, 500); // Fallback polling

    return () => {
      window.removeEventListener("storage", syncGuestCart);
      clearInterval(interval);
    };
  }, []);

  const itemCount = user
    ? basketItems?.reduce((total, item) => total + item.item_count, 0) || 0
    : guestCount;

  return (
    <AppBar
      position="fixed"
      color="default"
      sx={{ height: 50, boxShadow: "0 4px 4px rgba(0, 0, 0, 0.23)" }}
    >
      <Toolbar
        sx={{
          minHeight: "50px !important",
          px: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Left: Logo & Theme Toggle */}
        <Box display="flex" alignItems="center">
          <Typography
            component={NavLink}
            to="/"
            variant="h6"
            color="secondary"
            sx={{
              fontFamily: "'Dancing Script', cursive",
              fontWeight: 900,
              textDecoration: "none",
            }}
          >
            RE-STORE
          </Typography>
          <IconButton onClick={() => dispatch(setDarkMode())} sx={{ ml: 2 }}>
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Box>

        {/* Middle: Navigation Links */}
        <List sx={{ display: "flex" }}>
          {midLinks.map(({ title, path }) => (
            <ListItem component={NavLink} to={path} key={path} sx={navStyles}>
              {title.toUpperCase()}
            </ListItem>
          ))}
        </List>

        {/* Right: Cart + Auth */}
        <Box display="flex" alignItems="center">
          <IconButton component={Link} to="/basket" size="medium">
            <Badge badgeContent={itemCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {user ? (
            <Box display="flex" alignItems="center">
              <Typography
                component={NavLink}
                to="/profile"
                variant="h6"
                sx={{
                  ml: 2,
                  cursor: "pointer",
                  color: "secondary.main",
                  fontFamily: "'Dancing Script', cursive",
                  fontWeight: 900,
                  textDecoration: "none",
                }}
              >
                {user.UserName}
              </Typography>

              <Typography
                component={NavLink}
                to="/orders"
                variant="h6"
                sx={{
                  ml: 2,
                  cursor: "pointer",
                  color: "secondary.main",
                  fontFamily: "'Dancing Script', cursive",
                  fontWeight: 900,
                  textDecoration: "none",
                }}
              >
                Orders
              </Typography>
            </Box>
          ) : (
            <List sx={{ display: "flex" }}>
              {rightLinks.map(({ title, path }) => (
                <ListItem
                  component={NavLink}
                  to={path}
                  key={path}
                  sx={navStyles}
                >
                  {title.toUpperCase()}
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Toolbar>

      {isLoading && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress color="secondary" />
        </Box>
      )}
    </AppBar>
  );
}

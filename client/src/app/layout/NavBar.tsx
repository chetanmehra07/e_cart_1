import {
  AppBar,
  Badge,
  Box,
  Drawer,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import {
  DarkMode,
  LightMode,
  Menu as MenuIcon,
  ShoppingCart,
} from "@mui/icons-material";
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
    const interval = setInterval(syncGuestCart, 500);

    return () => {
      window.removeEventListener("storage", syncGuestCart);
      clearInterval(interval);
    };
  }, []);

  const itemCount = user
    ? basketItems?.reduce((total, item) => total + item.item_count, 0) || 0
    : guestCount;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawerContent = (
    <Box onClick={handleDrawerToggle} sx={{ width: 250 }}>
      <List>
        {midLinks.map(({ title, path }) => (
          <ListItem key={path} disablePadding>
            <ListItemButton component={NavLink} to={path} sx={navStyles}>
              {title.toUpperCase()}
            </ListItemButton>
          </ListItem>
        ))}
        {user ? (
          <>
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/profile" sx={navStyles}>
                {user.UserName}
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/orders" sx={navStyles}>
                Orders
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          rightLinks.map(({ title, path }) => (
            <ListItem key={path} disablePadding>
              <ListItemButton component={NavLink} to={path} sx={navStyles}>
                {title.toUpperCase()}
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );

  return (
    <>
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
          {/* Left: Logo + Theme toggle */}
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
            <IconButton onClick={() => dispatch(setDarkMode())} sx={{ ml: 1 }}>
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Box>

          {/* Desktop Nav */}
          {!isMobile ? (
            <>
              <List sx={{ display: "flex" }}>
                {midLinks.map(({ title, path }) => (
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
            </>
          ) : (
            // Mobile hamburger + cart icon
            <Box display="flex" alignItems="center">
              <IconButton component={Link} to="/basket" size="medium">
                <Badge badgeContent={itemCount} color="secondary">
                  <ShoppingCart />
                </Badge>
              </IconButton>
              <IconButton onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>

        {/* Drawer for mobile */}
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
        >
          {drawerContent}
        </Drawer>

        {/* Loading bar */}
        {isLoading && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress color="secondary" />
          </Box>
        )}
      </AppBar>
    </>
  );
}

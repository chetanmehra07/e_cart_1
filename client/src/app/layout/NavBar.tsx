import { DarkMode, LightMode, ShoppingCart } from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";

const midLinks = [
  {
    title: "catalog",
    path: "/catalog",
  },
  {
    title: "about",
    path: "/about",
  },
  {
    title: "contact",
    path: "/contact",
  },
];
const rightLinks = [
  {
    title: "login",
    path: "/login",
  },
  {
    title: "register",
    path: "/register",
  },
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

type Props = {
  toggleDarkMode: () => void;
  darkMode: boolean;
};

export default function NavBar({ darkMode, toggleDarkMode }: Props) {
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
        <Box display="flex" alignItems="center">
          <Typography
            component={NavLink}
            to="/"
            variant="h6"
            sx={{
              fontFamily: "'Dancing Script', cursive",
              fontWeight: 600,
              color: darkMode ? "#ffffff" : "#1a1a1a",
              textDecoration: "none",
            }}
          >
            RE-STORE
          </Typography>
          <IconButton onClick={toggleDarkMode} sx={{ ml: 2 }}>
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Box>
        <List sx={{ display: "flex" }}>
          {midLinks.map(({ title, path }) => (
            <ListItem component={NavLink} to={path} key={path} sx={navStyles}>
              {title.toUpperCase()}
            </ListItem>
          ))}
        </List>
        <Box display="flex" alignItems="center">
          <IconButton size="medium" sx={{ color: "inherit" }}>
            <Badge badgeContent="4" color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
          <List sx={{ display: "flex" }}>
            {rightLinks.map(({ title, path }) => (
              <ListItem component={NavLink} to={path} key={path} sx={navStyles}>
                {title.toUpperCase()}
              </ListItem>
            ))}
          </List>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

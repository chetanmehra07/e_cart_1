import {
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
  Snackbar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUser } from "../account/accountSlice";
import { useAppDispatch } from "../../app/store/store";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import type { CartItem } from "../../app/api/apiSlice";
import { clearGuestCart, getGuestCart } from "../basket/localCart";
import {
  useLazyFetchBasketQuery,
  useUpdateCartItemMutation,
} from "../../app/api/apiSlice";

export default function LoginPage() {
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [snackSuccess, setSnackSuccess] = useState(false);
  const [userName, setUserName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [updateCartItem] = useUpdateCartItemMutation();
  const [triggerFetchBasket] = useLazyFetchBasketQuery(); // ✅ Using lazy query

  // ✅ Merge guest cart to backend
  const mergeGuestCartToBackend = async (loginid: number) => {
    const guestCart: CartItem[] = getGuestCart();
    if (!guestCart.length) return;

    try {
      await Promise.all(
        guestCart.map((item) =>
          updateCartItem({
            loginid,
            product_id: item.product_id,
            item_count: item.item_count,
            added_date: new Date().toISOString().split("T")[0],
          })
        )
      );
      clearGuestCart(); // ✅ Clear guest cart after successful sync
      console.log("✅ Guest cart merged to backend");
    } catch (err) {
      console.error("❌ Failed to merge guest cart:", err);
    }
  };

  const handleLogin = async () => {
    setError("");

    try {
      const response = await fetch("http://localhost:8000/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNo, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError(errorText || "Login failed");
        return;
      }

      const data = await response.json(); // { loginid: 1, UserName: "Chetan" }

      if (!data.loginid || !data.UserName) {
        setError("Invalid response from server.");
        return;
      }

      dispatch(setUser({ loginid: data.loginid, UserName: data.UserName }));
      await mergeGuestCartToBackend(data.loginid); // ✅ Merge guest cart
      await triggerFetchBasket(data.loginid); // ✅ Refresh basket after merging

      setUserName(data.UserName);
      setSnackSuccess(true);

      setTimeout(() => {
        navigate("/catalog");
      }, 2000);
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" mb={3} textAlign="center">
          Login to Re-Store
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Phone Number"
          fullWidth
          margin="normal"
          value={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
          sx={{
            "& label.Mui-focused": { color: "secondary.main" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderWidth: "2px" },
              "&.Mui-focused fieldset": {
                borderColor: "secondary.main",
                borderWidth: "2px",
              },
            },
          }}
        />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  sx={{ padding: "20px" }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& label.Mui-focused": { color: "secondary.main" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderWidth: "2px" },
              "&.Mui-focused fieldset": {
                borderColor: "secondary.main",
                borderWidth: "2px",
              },
            },
          }}
        />

        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>
        <Typography variant="body2" textAlign="center" sx={{ mt: 3 }}>
          Don't have an account?{" "}
          <span
            style={{ color: "#9c27b0", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </Typography>
      </Paper>

      {/* ✅ Success Snackbar */}
      <Snackbar
        open={snackSuccess}
        autoHideDuration={3000}
        onClose={() => setSnackSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackSuccess(false)}
          severity="success"
          variant="filled"
          sx={{
            width: "100%",
            fontSize: "1rem",
            py: 1,
            borderRadius: "5px",
            backgroundColor: "secondary.main",
          }}
        >
          Hi, {userName}!
        </Alert>
      </Snackbar>
    </Container>
  );
}

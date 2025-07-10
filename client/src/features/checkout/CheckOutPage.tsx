import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PaymentsIcon from "@mui/icons-material/Payments";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { useAppSelector } from "../../app/store/store";
import { useClearCartMutation } from "../../app/api/apiSlice";

type CartItem = {
  product_id: number;
  item_count: number;
};

type UserAddress = {
  address_id: number;
  login_id: number;
  address_part1: string;
  address_part2: string;
  city: string;
  state: string;
  nation: string;
  pincode: string;
  landmark?: string;
};

export default function CheckoutPage() {
  const { user } = useAppSelector((state) => state.account);
  const loginid = user?.loginid;
  const navigate = useNavigate();
  const [clearCart] = useClearCartMutation();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(true);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState<React.ReactNode>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!loginid) return;

      try {
        const response = await fetch(
          `https://e-cart-backend-yrbb.onrender.com/user_address/get?login_id=${loginid}`
        );
        if (!response.ok) throw new Error("Failed to fetch addresses");
        const data: UserAddress[] = await response.json();
        setAddresses(data);
        setSelectedAddressId(data[0]?.address_id?.toString() || null);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [loginid]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId || !loginid) {
      setSnackMessage("⚠️ Please select a delivery address.");
      setSnackOpen(true);
      return;
    }

    try {
      const cartRes = await fetch(
        `https://e-cart-backend-yrbb.onrender.com/cart?loginid=${loginid}`
      );
      const cartItems: CartItem[] = await cartRes.json();

      if (!cartItems || cartItems.length === 0) {
        setSnackMessage("🛒 Your cart is empty.");
        setSnackOpen(true);
        return;
      }

      const orderPayload = {
        login_id: loginid,
        delivery_address: parseInt(selectedAddressId),
        payment_method: paymentMethod,
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.item_count,
        })),
      };

      await fetch("https://e-cart-backend-yrbb.onrender.com/order/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      await fetch(
        `https://e-cart-backend-yrbb.onrender.com/cart/clear?loginid=${loginid}`,
        { method: "DELETE" }
      );
      await clearCart(loginid);

      setSnackMessage(
        <>
          <Typography fontWeight="bold">
            ✅ Order placed successfully!
          </Typography>
          <Typography>
            💳 <strong>Payment:</strong> {paymentMethod.toUpperCase()}
          </Typography>
          <Typography>
            📦 <strong>Delivery Address ID:</strong> {selectedAddressId}
          </Typography>
        </>
      );
      setSnackOpen(true);
    } catch (error) {
      console.error("Order placement failed:", error);
      setSnackMessage("❌ Failed to place order. Please try again.");
      setSnackOpen(true);
    }

    setTimeout(() => navigate("/orders"), 1000);
  };

  return (
    <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 4 } }}>
      <Paper
        elevation={10}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 4,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight="bold"
          textAlign="center"
          mb={4}
        >
          Checkout
        </Typography>

        {loading ? (
          <Box textAlign="center" mt={2}>
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <>
            {/* Address Section */}
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Typography variant="h6" mb={2}>
                Select Delivery Address
              </Typography>
              <RadioGroup
                value={selectedAddressId}
                onChange={(e) => setSelectedAddressId(e.target.value)}
              >
                {addresses.length > 0 ? (
                  addresses.map((address) => (
                    <FormControlLabel
                      key={address.address_id}
                      value={address.address_id.toString()}
                      control={
                        <Radio
                          sx={{
                            color: "secondary.main",
                            "&.Mui-checked": { color: "secondary.main" },
                          }}
                        />
                      }
                      label={
                        <Box display="flex" flexDirection="column" mb={1}>
                          <Typography
                            fontWeight="bold"
                            fontSize={{ xs: "0.9rem", sm: "1rem" }}
                          >
                            {address.address_part1}, {address.address_part2}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {address.city}, {address.state}, {address.nation} -{" "}
                            {address.pincode}
                            {address.landmark &&
                              ` | Landmark: ${address.landmark}`}
                          </Typography>
                        </Box>
                      }
                    />
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontStyle="italic"
                  >
                    ⚠️ No saved addresses found.
                  </Typography>
                )}
              </RadioGroup>

              <Button
                variant="outlined"
                color="secondary"
                sx={{ mt: 2, alignSelf: "flex-start" }}
                component={Link}
                to="/add-address"
                state={{ from: "/checkout" }}
              >
                + Add Address
              </Button>
            </FormControl>

            {/* Payment Section */}
            <FormControl fullWidth>
              <Typography variant="h6" mb={2}>
                Select Payment Method
              </Typography>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                {[
                  {
                    value: "cod",
                    label: "Cash on Delivery",
                    icon: <PaymentsIcon />,
                  },
                  {
                    value: "card",
                    label: "Credit/Debit Card",
                    icon: <CreditCardIcon />,
                  },
                  { value: "upi", label: "UPI", icon: <CurrencyRupeeIcon /> },
                ].map((method) => (
                  <FormControlLabel
                    key={method.value}
                    value={method.value}
                    control={
                      <Radio
                        sx={{
                          color: "secondary.main",
                          "&.Mui-checked": { color: "secondary.main" },
                        }}
                      />
                    }
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        {method.icon}
                        <Typography>{method.label}</Typography>
                      </Box>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <Typography
              variant="body2"
              color="text.secondary"
              mt={2}
              textAlign="center"
              fontStyle="italic"
            >
              ⚠️ Note: Payments are currently disabled. You can still place your
              order — no actual payment will be processed.
            </Typography>

            {/* Buttons */}
            <Box
              mt={5}
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              gap={2}
            >
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handlePlaceOrder}
                sx={{ fontWeight: "bold", borderRadius: 2, py: 1.2 }}
              >
                Place Order
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                component={Link}
                to="/basket"
                sx={{ fontWeight: "bold", borderRadius: 2, py: 1.2 }}
              >
                Cancel
              </Button>
            </Box>
          </>
        )}
      </Paper>

      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity="success"
          variant="filled"
          sx={{
            width: "100%",
            fontSize: "1rem",
            py: 1,
            px: 2,
            borderRadius: "8px",
            backgroundColor: "secondary.main",
          }}
        >
          {snackMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

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
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PaymentsIcon from "@mui/icons-material/Payments";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { useAppSelector } from "../../app/store/store";

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

  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(true);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState<React.ReactNode>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!loginid) return;

      try {
        const response = await fetch(
          `http://localhost:8000/user_address/get?login_id=${loginid}`
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

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      setSnackMessage("⚠️ Please select a delivery address.");
      setSnackOpen(true);
      return;
    }

    // Get full address object
    const selectedAddress = addresses.find(
      (addr) => addr.address_id.toString() === selectedAddressId
    );

    if (!selectedAddress) {
      setSnackMessage("⚠️ Selected address not found.");
      setSnackOpen(true);
      return;
    }

    const fullAddress = `${selectedAddress.address_part1}, ${
      selectedAddress.address_part2
    }, ${selectedAddress.city}, ${selectedAddress.state}, ${
      selectedAddress.nation
    } - ${selectedAddress.pincode}${
      selectedAddress.landmark ? ` | Landmark: ${selectedAddress.landmark}` : ""
    }`;

    setSnackMessage(
      <>
        <Typography fontWeight="bold">✅ Order placed!</Typography>
        <Typography>
          💳 <strong>Payment:</strong> {paymentMethod.toUpperCase()}
        </Typography>
        <Typography>
          📦 <strong>Delivery Address:</strong> {fullAddress}
        </Typography>
      </>
    );
    setSnackOpen(true);
  };

  return (
    <Container maxWidth="md">
      <Paper
        elevation={10}
        sx={{
          p: 5,
          borderRadius: 4,
          background: "secondary",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          mb={4}
          color="secondary"
        >
          Checkout
        </Typography>

        {loading ? (
          <Box textAlign="center" mt={2}>
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <>
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
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="flex-start"
                          mb={2}
                        >
                          <Typography fontWeight="bold">
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
                  <Typography color="error" textAlign="center">
                    ⚠️ No saved addresses found.
                  </Typography>
                )}
              </RadioGroup>

              {/* Add Address Button */}
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

            <FormControl fullWidth>
              <Typography variant="h6" mb={2}>
                Select Payment Method
              </Typography>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  value="cod"
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
                      <PaymentsIcon />
                      <Typography>Cash on Delivery</Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="card"
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
                      <CreditCardIcon />
                      <Typography>Credit/Debit Card</Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="upi"
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
                      <CurrencyRupeeIcon />
                      <Typography>UPI</Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 2, fontStyle: "italic", textAlign: "center" }}
            >
              ⚠️ Note: Payments are currently disabled. You can still place your
              order — no actual payment will be processed.
            </Typography>

            <Box
              mt={5}
              display="flex"
              justifyContent="space-between"
              gap={2}
              flexWrap="wrap"
            >
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                sx={{ fontWeight: "bold", borderRadius: 2, py: 1.3, flex: 1 }}
                onClick={handlePlaceOrder}
              >
                Place Order
              </Button>

              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                component={Link}
                to="/basket"
                sx={{ fontWeight: "bold", borderRadius: 2, py: 1.3, flex: 1 }}
              >
                Cancel
              </Button>
            </Box>
          </>
        )}
      </Paper>

      {/* Snackbar */}
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

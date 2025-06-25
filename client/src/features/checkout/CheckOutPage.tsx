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
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import PaymentsIcon from "@mui/icons-material/Payments";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handlePlaceOrder = () => {
    alert(`✅ Order placed using: ${paymentMethod.toUpperCase()}`);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 12 }}>
      <Paper
        elevation={10}
        sx={{
          p: 5,
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.9)",
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

        <FormControl component="fieldset" fullWidth>
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
            sx={{
              fontWeight: "bold",
              borderRadius: 2,
              py: 1.3,
              flex: 1,
            }}
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
            sx={{
              fontWeight: "bold",
              borderRadius: 2,
              py: 1.3,
              flex: 1,
            }}
          >
            Cancel
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

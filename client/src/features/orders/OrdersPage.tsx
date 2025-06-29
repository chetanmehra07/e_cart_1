import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../app/store/store";
import { Link } from "react-router-dom";

type Order = {
  order_id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  order_date: string;
  delivery_date: string;
  quantity: number;
  total_price: number;
  delivery_address: string;
};

export default function OrderPage() {
  const { user } = useAppSelector((state) => state.account);
  const loginid = user?.loginid ?? 1;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackOpen, setSnackOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/orders?login_id=${loginid}`
        );
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [loginid]);

  const cancelOrder = async (order_id: number) => {
    try {
      const res = await fetch(
        `http://localhost:8000/orders/cancel?order_id=${order_id}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.order_id !== order_id));
        setSnackOpen(true);
      } else {
        console.error("❌ Cancel failed");
      }
    } catch (err) {
      console.error("Error canceling order:", err);
    }
  };

  return (
    <Box p={{ xs: 2, md: 4 }}>
      <Typography
        variant="h3"
        fontWeight="bold"
        textAlign="center"
        mb={4}
        mt={-4}
        color="secondary"
      >
        Your Orders
      </Typography>

      {loading ? (
        <Box textAlign="center">
          <CircularProgress color="secondary" />
        </Box>
      ) : orders.length === 0 ? (
        <Typography textAlign="center" fontSize="1.3rem">
          No active orders found.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {orders.map((order) => (
            <Grid item xs={12} md={6} key={order.order_id}>
              <Paper
                sx={{
                  position: "relative",
                  display: "flex",
                  gap: 3,
                  p: 3,
                  borderRadius: 3,
                  background: "rgba(135, 128, 138, 0.37)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)",
                }}
              >
                {/* Cancel Button Top Right */}
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => cancelOrder(order.order_id)}
                  sx={{
                    position: "absolute",
                    color: "secondary.main",
                    backgroundColor: "rgba(254, 252, 255, 0.93)",
                    top: 20,
                    right: 25,
                    fontWeight: "bold",
                    fontSize: "1.rem",
                    borderRadius: 1.4,
                    minWidth: "auto",
                    px: 3.5,
                    "&:hover": {
                      backgroundColor: "rgba(251, 244, 255, 0.91)",
                    },
                  }}
                >
                  Cancel
                </Button>

                <Link to={`/catalog/${order.product_id}`}>
                  <Box
                    component="img"
                    src={order.product_image}
                    alt={order.product_name}
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: 2,
                      objectFit: "cover",
                      border: "2px solid #eee",
                    }}
                  />
                </Link>

                <Box flex={1}>
                  <Link
                    to={`/catalog/${order.product_id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      sx={{
                        color: "secondary.main",
                        cursor: "pointer",
                      }}
                    >
                      {order.product_name}
                    </Typography>
                  </Link>

                  <Typography variant="body2">
                    <strong>Qty:</strong> {order.quantity}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Order Date:</strong> {order.order_date}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Delivery:</strong> {order.delivery_date}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "secondary.main", fontWeight: "bold" }}
                  >
                    ₹{order.total_price.toFixed(2)}
                  </Typography>

                  <Divider sx={{ my: 1.5 }} />

                  {/* 🏠 Delivery Address */}
                  <Typography fontSize="0.9rem" fontWeight="bold">
                    Delivery Address:
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ whiteSpace: "pre-line", fontStyle: "italic" }}
                  >
                    {order.delivery_address}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ✅ Snackbar for Cancel Confirmation */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={5000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="warning"
          variant="filled"
          onClose={() => setSnackOpen(false)}
          sx={{ fontWeight: "bold" }}
        >
          Your order has been canceled. Payment will be refunded in 2 days.
        </Alert>
      </Snackbar>
    </Box>
  );
}

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
  MRP: number;
  discount: number;
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
          `https://e-cart-backend-yrbb.onrender.com/orders?login_id=${loginid}`
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
        `https://e-cart-backend-yrbb.onrender.com/orders/cancel?order_id=${order_id}`,
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
      {/* Title + Buy History Button */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        mt={-4}
      >
        <Typography variant="h3" fontWeight="bold" color="secondary">
          Your Orders
        </Typography>

        <Button
          variant="contained"
          component={Link}
          to="/buyhistory"
          sx={{
            fontWeight: "bold",
            fontSize: "1rem",
            borderRadius: 2,
            padding: "8px 16px",
            px: 3,
            color: "white ",
            backgroundColor: "secondary.main",
          }}
        >
          Buy History
        </Button>
      </Box>

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
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.25)",
                }}
              >
                {/* Cancel Button */}
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
                    fontSize: "1rem",
                    borderRadius: 1.4,
                    px: 3.5,
                    "&:hover": {
                      backgroundColor: "rgb(250, 250, 250)",
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
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{ color: "secondary.main", fontWeight: "bold" }}
                      >
                        $
                        {(
                          (order.MRP / 100) *
                          (1 - order.discount / 100)
                        ).toFixed(2)}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontStyle: "italic" }}
                      >
                        <s>${(order.MRP / 100).toFixed(2)}</s> (
                        {order.discount.toFixed(0)}% OFF)
                      </Typography>
                    </Box>

                    {/* Days Left */}
                    <Typography
                      variant="caption"
                      sx={{
                        fontStyle: "italic",
                        color: "text.secondary",
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                      }}
                    >
                      {(() => {
                        const today = new Date();
                        const deliveryDate = new Date(order.delivery_date);
                        const daysLeft = Math.ceil(
                          (deliveryDate.getTime() - today.getTime()) /
                            (1000 * 60 * 60 * 24)
                        );
                        return daysLeft > 0
                          ? `${daysLeft} day${
                              daysLeft > 1 ? "s" : ""
                            } left in delivery`
                          : daysLeft === 0
                          ? "Delivering today"
                          : "Delivered";
                      })()}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

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

      {/* Snackbar */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="warning"
          variant="filled"
          onClose={() => setSnackOpen(false)}
          sx={{
            width: "100%",
            fontSize: "1rem",
            py: 1,
            borderRadius: "10px",
          }}
        >
          Your order has been canceled. Payment will be refunded in 2 days.
        </Alert>
      </Snackbar>
    </Box>
  );
}

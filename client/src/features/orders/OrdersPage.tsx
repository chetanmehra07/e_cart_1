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
  useMediaQuery,
  useTheme,
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        { method: "DELETE" }
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
      {/* Header */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={2}
        mb={4}
        mt={{ xs: -2, md: -4 }}
      >
        <Typography
          variant={isMobile ? "h5" : "h3"}
          fontWeight="bold"
          color="secondary"
        >
          Your Orders
        </Typography>

        <Button
          variant="contained"
          component={Link}
          to="/buyhistory"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "0.85rem", sm: "1rem" },
            borderRadius: 2,
            px: 3,
            py: 1,
            backgroundColor: "secondary.main",
            color: "white",
          }}
        >
          Buy History
        </Button>
      </Box>

      {/* Content */}
      {loading ? (
        <Box textAlign="center">
          <CircularProgress color="secondary" />
        </Box>
      ) : orders.length === 0 ? (
        <Typography textAlign="center" fontSize={{ xs: "1rem", sm: "1.3rem" }}>
          No active orders found.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} sm={12} md={6} key={order.order_id}>
              <Paper
                sx={{
                  position: "relative",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  p: 2.5,
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
                  onClick={() => cancelOrder(order.order_id)}
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    fontSize: { xs: "0.75rem", sm: "1rem" },
                    px: { xs: 2, sm: 3.5 },
                    py: 0.5,
                    color: "secondary.main",
                    backgroundColor: "rgba(254, 252, 255, 0.93)",
                    fontWeight: "bold",
                    borderRadius: 1.5,
                    zIndex: 1,
                    "&:hover": {
                      backgroundColor: "#fafafa",
                    },
                  }}
                >
                  Cancel
                </Button>

                {/* Product Image */}
                <Link to={`/catalog/${order.product_id}`}>
                  <Box
                    component="img"
                    src={order.product_image}
                    alt={order.product_name}
                    sx={{
                      width: { xs: 80, sm: 100 },
                      height: { xs: 80, sm: 100 },
                      borderRadius: 2,
                      objectFit: "cover",
                      border: "2px solid #eee",
                    }}
                  />
                </Link>

                {/* Info */}
                <Box flex={1}>
                  <Link
                    to={`/catalog/${order.product_id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Typography
                      variant="h6"
                      fontSize={{ xs: "1rem", sm: "1.1rem" }}
                      fontWeight="bold"
                      color="secondary"
                      sx={{ mb: 1 }}
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
                    flexWrap="wrap"
                    mt={1}
                  >
                    <Box>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="secondary"
                      >
                        ₹
                        {(
                          (order.MRP / 100) *
                          (1 - order.discount / 100)
                        ).toFixed(2)}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontStyle="italic"
                      >
                        <s>₹{(order.MRP / 100).toFixed(2)}</s> (
                        {order.discount.toFixed(0)}% OFF)
                      </Typography>
                    </Box>

                    <Typography
                      variant="caption"
                      fontStyle="italic"
                      fontWeight="bold"
                      color="text.secondary"
                      fontSize={{ xs: "0.75rem", sm: "0.85rem" }}
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

                  <Typography
                    fontSize={{ xs: "0.85rem", sm: "0.95rem" }}
                    fontWeight="bold"
                  >
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

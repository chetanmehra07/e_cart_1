import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";

import {
  useDeleteCartItemMutation,
  useFetchBasketQuery,
  useUpdateCartItemMutation,
  type CartItem,
} from "../../app/api/apiSlice";
import { Link } from "react-router-dom";

const loginid = 1;

export default function BasketPage() {
  const { data, isLoading } = useFetchBasketQuery(loginid);
  const [updateCartItem] = useUpdateCartItemMutation();
  const [deleteCartItem] = useDeleteCartItemMutation();

  if (isLoading) return <Typography>Loading...</Typography>;
  if (!data || data.length === 0)
    return (
      <Paper
        sx={{
          borderRadius: 2,
          background: "rgba(135, 128, 138, 0.37)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.37)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h2" color="secondary" sx={{ fontWeight: "350" }}>
          Your cart is empty
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          sx={{
            mt: 10,
            px: 6,
            fontWeight: "bold",
            borderRadius: 2,
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
          component={Link}
          to={`/catalog`}
        >
          Go to Shop
        </Button>
      </Paper>
    );

  const calculateSubtotal = (items: CartItem[]) =>
    items.reduce(
      (sum, item) =>
        sum + (item.MRP / 100) * (1 - item.discount / 100) * item.item_count,
      0
    );

  const subtotal = calculateSubtotal(data);
  const discount = subtotal * 0.005; // 0.1%
  const deliveryFee = subtotal > 100 ? 0 : subtotal * 0.01; // 1% if <= 100
  const finalTotal = subtotal - discount + deliveryFee;

  return (
    <Grid container spacing={4} p={4}>
      <Grid item xs={12} md={8}>
        {data.map((item) => {
          const unitPrice = (item.MRP / 100) * (1 - item.discount / 100);
          const itemTotal = unitPrice * item.item_count;

          return (
            <Paper
              key={item.cart_id}
              sx={{
                display: "flex",
                p: 2,
                mb: 2,
                backgroundColor: "gray",
                color: "white",
                borderRadius: 2,
                background: "rgba(135, 128, 138, 0.37)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.37)",
                alignItems: "stretch",
                minHeight: 130,
              }}
            >
              {/* Product Image */}
              <Link to={`/catalog/${item.product_id}`}>
                <Box
                  component="img"
                  src={item.product_image}
                  alt={item.product_name}
                  sx={{
                    width: 120, // square dimensions
                    height: 120,
                    borderRadius: 2,
                    objectFit: "cover",
                    mr: 2,
                  }}
                />
              </Link>

              {/* Product Info */}
              <Box flex={1}>
                {/* Product Name */}
                <Link
                  to={`/catalog/${item.product_id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="secondary"
                    sx={{
                      "&:hover": {
                        color: "secondary.main",
                      },
                    }}
                  >
                    {item.product_name}
                  </Typography>
                </Link>

                {/* Unit × Count = Total */}
                <Typography mt={0.5} color="text.primary">
                  ${unitPrice.toFixed(2)} × {item.item_count} ={" "}
                  <strong>${itemTotal.toFixed(2)}</strong>
                </Typography>

                {/* Discount Line */}
                <Typography variant="caption" color="secondary" display="block">
                  ({item.discount.toFixed(0)}% OFF)
                </Typography>

                {/* Quantity Control */}
                <Box display="flex" alignItems="center" mt={1}>
                  <IconButton
                    size="small"
                    sx={{
                      color: "secondary.main",
                      width: 40,
                      height: 32,
                      borderRadius: 2, // Makes it square (borderRadius: 0 is sharp corners)
                      backgroundColor: "white",
                      "&:hover": {
                        backgroundColor: "#f0f0f0",
                      },
                    }}
                    onClick={() =>
                      item.item_count > 1 &&
                      updateCartItem({
                        loginid,
                        product_id: item.product_id,
                        item_count: item.item_count - 1,
                        added_date: new Date().toISOString().split("T")[0],
                      })
                    }
                  >
                    <Remove />
                  </IconButton>
                  <Typography
                    mx={1}
                    marginLeft={3}
                    marginRight={3}
                    color="text.primary"
                    fontSize="1.4rem"
                  >
                    {item.item_count}
                  </Typography>
                  <IconButton
                    size="small"
                    sx={{
                      color: "whitesmoke",
                      width: 40,
                      height: 32,
                      borderRadius: 2,
                      backgroundColor: "secondary.main",
                      "&:hover": {
                        backgroundColor: "rgba(123, 31, 162, 0.8)",
                      },
                    }}
                    onClick={() =>
                      updateCartItem({
                        loginid,
                        product_id: item.product_id,
                        item_count: item.item_count + 1,
                        added_date: new Date().toISOString().split("T")[0],
                      })
                    }
                  >
                    <Add />
                  </IconButton>
                </Box>
              </Box>

              {/* Delete Button */}
              <IconButton
                aria-label="Remove item"
                onClick={() =>
                  deleteCartItem({ loginid, productid: item.product_id })
                }
                sx={{
                  borderRadius: 2,
                  // 🔴 Rectangle instead of oval
                  padding: "15px", // tight padding, change if needed
                  "&:hover": {
                    boxShadow: 2, // optional glow
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Paper>
          );
        })}
      </Grid>

      {/* Order Summary */}
      <Grid item xs={12} md={4}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            background: "rgba(135, 128, 138, 0.37)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.37)",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "400" }}>
            Order summary
          </Typography>
          <Typography
            color="secondary"
            sx={{ fontSize: "0.88rem" }}
            gutterBottom
          >
            Orders over $100 qualify for free delivery!
          </Typography>
          <Divider sx={{ my: 1 }} />

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Subtotal</Typography>
            <Typography>${subtotal.toFixed(2)}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>App Discount (0.5%)</Typography>
            <Typography sx={{ color: "secondary.main" }}>
              -${discount.toFixed(2)}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography>Delivery fee</Typography>
            <Typography>
              {deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`}
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h5" color="secondary">
              Total
            </Typography>
            <Typography variant="h5" color="secondary">
              ${finalTotal.toFixed(2)}
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            component={Link} // 👈 make it behave like a <Link>
            to="/checkout"
            sx={{
              backgroundColor: "secondary.main",
              color: "whitesmoke",
              fontSize: "1rem",
              borderRadius: "10px",
              fontWeight: "600",
              padding: 1.2,
            }}
          >
            CHECKOUT
          </Button>
          <Button
            fullWidth
            sx={{
              mt: 1,
              color: "secondary.main",
              backgroundColor: "whitesmoke",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: "600",
              padding: 1.2,
            }}
            component={Link}
            to={`/catalog`}
          >
            CONTINUE SHOPPING
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
}

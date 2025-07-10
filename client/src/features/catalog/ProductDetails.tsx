import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useFetchProductDetailsQuery } from "./catalogApi";
import {
  useUpdateCartItemMutation,
  useFetchBasketQuery,
  type CartItem,
} from "../../app/api/apiSlice";
import { useAppSelector } from "../../app/store/store";
import { getGuestCart, saveGuestCart } from "../basket/localCart";

export default function ProductDetails() {
  const { user } = useAppSelector((state) => state.account);
  const loginid = user?.loginid ?? 1;
  const { id } = useParams();
  const { data: product, isLoading } = useFetchProductDetailsQuery(
    id ? +id : 0
  );
  const { data: basket } = useFetchBasketQuery(loginid);
  const [updateCartItem] = useUpdateCartItemMutation();
  const [quantity, setQuantity] = useState(1);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackError, setSnackError] = useState(false);
  const [snackMaxReached, setSnackMaxReached] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!product || isLoading) return <div>Loading...</div>;

  let existingCount = 0;

  if (user) {
    const existingItem = basket?.find(
      (item) => item.product_id === product.product_id
    );
    existingCount = existingItem?.item_count ?? 0;
  } else {
    const guestCart: CartItem[] = getGuestCart();
    const guestItem = guestCart.find(
      (item) => item.product_id === product.product_id
    );
    existingCount = guestItem?.item_count ?? 0;
  }

  const maxAllowedQuantity = product.stock_avl - existingCount;

  const ProductDetails = [
    { label: "Name", value: product.product_name },
    { label: "Description", value: product.specs },
    { label: "Type", value: product.category_name },
    { label: "Discount", value: `${product.discount.toFixed(2)}%` },
    {
      label: "Free delivery",
      value: product.free_delivery_status ? "Yes" : "No",
    },
    { label: "Quantity in stock", value: product.stock_avl },
  ];

  const handleAddToCart = async () => {
    try {
      const totalDesired = existingCount + quantity;
      if (totalDesired > product.stock_avl) {
        setSnackMaxReached(true);
        return;
      }
      if (user) {
        await updateCartItem({
          loginid,
          product_id: product.product_id,
          item_count: totalDesired,
          added_date: new Date().toISOString().split("T")[0],
        });
      } else {
        const guestCart: CartItem[] = getGuestCart();
        const existingIndex = guestCart.findIndex(
          (item) => item.product_id === product.product_id
        );
        if (existingIndex !== -1) {
          if (
            guestCart[existingIndex].item_count + quantity >
            product.stock_avl
          ) {
            setSnackMaxReached(true);
            return;
          }
          guestCart[existingIndex].item_count += quantity;
        } else {
          guestCart.push({
            cart_id: Date.now(),
            product_id: product.product_id,
            item_count: quantity,
            added_date: new Date().toISOString().split("T")[0],
            product_name: product.product_name,
            MRP: product.MRP,
            product_image: product.product_image,
            discount: product.discount,
            stock_avl: product.stock_avl,
          });
        }
        saveGuestCart(guestCart);
        window.dispatchEvent(new Event("storage"));
      }
      setSnackOpen(true);
    } catch (err) {
      console.error("Add to cart failed:", err);
      setSnackError(true);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "hidden",
        px: { xs: 2, sm: 4 },
        pt: 4,
        boxSizing: "border-box",
      }}
    >
      <Grid
        container
        spacing={4}
        maxWidth="lg"
        sx={{ mx: "auto", ml: { xs: -4, sm: -4, md: -4 } }}
      >
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={product.product_image}
            alt={product.product_name}
            sx={{ width: "100%", maxWidth: "100%", display: "block" }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant={isMobile ? "h5" : "h3"}>
            {product.product_name}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h5" color="secondary.main" fontWeight="bold">
            ${((product.MRP / 100) * (1 - product.discount / 100)).toFixed(2)}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            <s>${(product.MRP / 100).toFixed(2)}</s> &nbsp; (
            {product.discount.toFixed(0)}% OFF)
          </Typography>

          <TableContainer sx={{ mt: 2, maxWidth: "100%" }}>
            <Table>
              <TableBody>
                {ProductDetails.map((detail, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {detail.label}
                    </TableCell>
                    <TableCell>{detail.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box mt={3}>
            <Typography
              variant="h6"
              fontWeight={500}
              gutterBottom
              color="secondary.main"
            >
              Applicable Policies
            </Typography>
            {product.applicable_policies?.length ? (
              product.applicable_policies.map((policy, index) => (
                <Box key={index} mb={2} ml={1.5}>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        bgcolor: "secondary.main",
                        borderRadius: "50%",
                        mr: 1,
                      }}
                    />
                    <Typography variant="subtitle1" fontWeight="bold">
                      {policy.policy_name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" ml={3}>
                    {policy.policy_description}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" ml={2}>
                No applicable policies.
              </Typography>
            )}
          </Box>

          <Grid container spacing={2} mt={3}>
            {product.stock_avl > 0 ? (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (!isNaN(val)) {
                        setQuantity(
                          Math.max(1, Math.min(val, maxAllowedQuantity))
                        );
                      }
                    }}
                    onKeyDown={(e) => {
                      e.preventDefault(); // ⛔ block all typing
                    }}
                    inputProps={{
                      min: 1,
                      max: maxAllowedQuantity,
                      step: 1,
                    }}
                    fullWidth
                    sx={{
                      "& label.Mui-focused": { color: "secondary.main" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderWidth: "2px" },
                        "&.Mui-focused fieldset": {
                          borderColor: "secondary.main",
                          borderWidth: "2px",
                        },
                        "& input": {
                          cursor: "default",
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="secondary"
                    sx={{ height: "56px", fontSize: "1rem", fontWeight: 500 }}
                    onClick={handleAddToCart}
                  >
                    Add to Basket
                  </Button>
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  align="center"
                  sx={{ mt: 2, fontWeight: 600, color: "secondary.main" }}
                >
                  Out of Stock
                </Typography>
                <Button
                  variant="contained"
                  disabled
                  fullWidth
                  sx={{
                    mt: 1,
                    height: "53px",
                    fontSize: "1rem",
                    fontWeight: 500,
                    bgcolor: "grey.400",
                  }}
                >
                  Add to Basket
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>

      {/* Snackbars */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity="success"
          variant="filled"
          sx={{ backgroundColor: "secondary.main" }}
        >
          Added to cart successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={snackError}
        autoHideDuration={3000}
        onClose={() => setSnackError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackError(false)}
          severity="error"
          variant="filled"
        >
          Failed to add item to cart!
        </Alert>
      </Snackbar>

      <Snackbar
        open={snackMaxReached}
        autoHideDuration={4000}
        onClose={() => setSnackMaxReached(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackMaxReached(false)}
          severity="warning"
          variant="filled"
          sx={{ backgroundColor: "secondary.main" }}
        >
          Maximum quantity reached. You already have {existingCount} item
          {existingCount > 1 ? "s" : ""} in your cart.
        </Alert>
      </Snackbar>
    </Box>
  );
}

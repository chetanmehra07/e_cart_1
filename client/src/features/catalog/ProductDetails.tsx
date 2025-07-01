import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  Grid2,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useFetchProductDetailsQuery } from "./catalogApi";
import {
  useUpdateCartItemMutation,
  useFetchBasketQuery,
} from "../../app/api/apiSlice";
import { useAppSelector } from "../../app/store/store";

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

  if (!product || isLoading) return <div>Loading...</div>;

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
      const existingItem = basket?.find(
        (item) => item.product_id === product.product_id
      );
      const updatedCount = existingItem
        ? existingItem.item_count + quantity
        : quantity;

      await updateCartItem({
        loginid,
        product_id: product.product_id,
        item_count: updatedCount,
        added_date: new Date().toISOString().split("T")[0],
      });
      setSnackOpen(true);
    } catch (err) {
      console.error("Add to cart failed:", err);
      setSnackError(true);
    }
  };

  return (
    <Grid2 container spacing={6} maxWidth="lg" sx={{ mx: "auto" }}>
      <Grid2 size={6}>
        <img
          src={product?.product_image}
          alt={product?.product_name}
          style={{ width: "100%" }}
        />
      </Grid2>
      <Grid2 size={6}>
        <Typography variant="h3">{product.product_name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color="secondary.main" fontWeight="bold">
          ${((product.MRP / 100) * (1 - product.discount / 100)).toFixed(2)}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          <s>${(product.MRP / 100).toFixed(2)}</s> &nbsp; (
          {product.discount.toFixed(0)}% OFF)
        </Typography>

        <TableContainer>
          <Table sx={{ fontSize: "2rem" }}>
            <TableBody>
              {ProductDetails.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    {detail.label}
                  </TableCell>
                  <TableCell sx={{ fontSize: "1.2rem" }}>
                    {detail.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Policies */}
        {/* Policies */}
        <Box mt={2}>
          <Typography
            variant="h5"
            fontWeight="500"
            gutterBottom
            sx={{ color: "secondary.main", mb: 1 }}
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
                      flexShrink: 0,
                    }}
                  />
                  <Typography variant="subtitle1" fontWeight="bold">
                    {policy.policy_name}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 3 }}
                >
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

        {/* Add to Basket */}
        <Grid2 container spacing={2} marginTop={3}>
          <Grid2 size={6}>
            <TextField
              variant="outlined"
              type="number"
              label="Quantity in basket"
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
              fullWidth
              inputProps={{
                min: 1,
                max: product.stock_avl,
              }}
              value={quantity}
              onChange={(e) => {
                const val = Math.max(
                  1,
                  Math.min(+e.target.value, product.stock_avl)
                );
                setQuantity(val);
              }}
            />
          </Grid2>
          <Grid2 size={6}>
            <Button
              sx={{ height: "53px", fontSize: "1rem", fontWeight: "500" }}
              color="secondary"
              size="large"
              variant="contained"
              fullWidth
              onClick={handleAddToCart}
            >
              Add to Basket
            </Button>
          </Grid2>
        </Grid2>
      </Grid2>

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
          sx={{
            width: "100%",
            fontSize: "1rem",
            py: 1,
            borderRadius: "10px",
            backgroundColor: "secondary.main",
          }}
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
    </Grid2>
  );
}

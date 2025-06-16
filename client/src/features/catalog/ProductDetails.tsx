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
} from "@mui/material";
import { useFetchProductDetailsQuery } from "./catalogApi";

export default function ProductDetails() {
  const { id } = useParams();
  const { data: product, isLoading } = useFetchProductDetailsQuery(
    id ? +id : 0
  );

  if (!product || isLoading) return <div>Loading...</div>;

  const ProductDetails = [
    { label: "Name", value: product.product_name },
    { label: "Description", value: product.specs },
    { label: "Type", value: product.category_name },
    { label: "Discount in %", value: product.discount },
    {
      label: "Free delivery",
      value: product.free_delivery_status ? "Yes" : "No",
    },
    { label: "Quantity in stock", value: product.stock_avl },
  ];

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
        <Divider sx={{ mb: "9" }} />
        <Typography variant="h4" color="secondary.main">
          ${(product.MRP / 100).toFixed(2)}
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
        <Box mt={1}>
          <Typography
            variant="h5"
            fontWeight="500"
            gutterBottom
            marginBottom="10px"
            marginLeft="3px"
            sx={{ color: "secondary.main" }}
          >
            Applicable Policies
          </Typography>
          {product.applicable_policies?.map((policy, index) => (
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
                sx={{ ml: 3 }} // aligns under the text, not the bullet
              >
                {policy.policy_description}
              </Typography>
            </Box>
          ))}
        </Box>
        <Grid2 container spacing={2} marginTop={3}>
          <Grid2 size={6}>
            <TextField
              variant="outlined"
              type="number"
              label="Quantity in basket"
              fullWidth
              defaultValue={1}
            />
          </Grid2>
          <Grid2 size={6}>
            <Button
              sx={{ height: "53px", fontSize: "1rem", fontWeight: "500" }}
              color="secondary"
              size="large"
              variant="contained"
              fullWidth
            >
              Add to Basket
            </Button>
          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}

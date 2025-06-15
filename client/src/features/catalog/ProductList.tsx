import { Box } from "@mui/material";
import type { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
};

export default function ProductList({ products }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2.5,
        justifyContent: "center",
        maxWidth: 4 * 300 + 4 * 16, // card width + gaps (approx)
        mx: "auto",
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </Box>
  );
}

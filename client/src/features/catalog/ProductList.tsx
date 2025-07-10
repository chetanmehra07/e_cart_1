import { Grid } from "@mui/material";
import type { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
};

export default function ProductList({ products }: Props) {
  return (
    <Grid
      container
      spacing={{ xs: 1.5, sm: 2 }}
      justifyContent="center"
      sx={{
        px: { xs: 1, sm: 2 },
        pt: { xs: 2, sm: 3 },
        mt: { xs: -2, sm: -4, md: -5 },
        maxWidth: "1400px",
        mx: "auto",
      }}
    >
      {products.map((product) => (
        <Grid
          item
          key={product.product_id}
          xs={12} // 👈 1 card per row on tiny screens
          sm={6} // 📱 2 cards per row on phones
          md={4} // 📲 3 cards per row on tablets
          lg={3} // 💻 4 cards per row on laptops
        >
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}

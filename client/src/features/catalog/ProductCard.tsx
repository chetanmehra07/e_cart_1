import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import type { Product } from "../../app/models/product";
import { Link } from "react-router-dom";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <Card
      elevation={10}
      sx={{
        width: 300,
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "rgba(17, 17, 17, 0.29)", // text inside
        backdropFilter: "blur(12px)", // subtle glass effect (optional)
      }}
    >
      <CardMedia
        sx={{ height: 280, backgroundSize: "cover" }}
        image={product.product_image}
        title={product.product_name}
      />
      <CardContent>
        <Typography
          gutterBottom
          variant="h6"
          sx={{ textTransform: "uppercase" }}
        >
          {product.product_name}
        </Typography>
        <Typography variant="subtitle1">
          ${(product.MRP / 100).toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between" }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "rgba(39, 165, 194, 0.67)",
            color: "whitesmoke",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "rgb(16, 177, 213)",
            },
          }}
        >
          Add to cart
        </Button>
        <Button
          component={Link}
          to={`/catalog/${product.product_id}`}
          variant="contained"
          sx={{
            backgroundColor: "rgba(89, 28, 139, 0.63)",
            color: "whitesmoke",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "rgb(123, 34, 195)",
            },
          }}
        >
          view
        </Button>
      </CardActions>
    </Card>
  );
}

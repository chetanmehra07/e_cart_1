import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  useUpdateCartItemMutation,
  useFetchBasketQuery,
  type CartItem,
} from "../../app/api/apiSlice";
import type { Product } from "../../app/models/product";
import { useState } from "react";
import { useAppSelector } from "../../app/store/store";
import { getGuestCart, saveGuestCart } from "../basket/localCart";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const userLoginId = useAppSelector((state) => state.account.user?.loginid);
  const isLoggedIn = !!userLoginId;

  const { data: basket } = useFetchBasketQuery(userLoginId!, {
    skip: !isLoggedIn,
  });
  const [updateCartItem] = useUpdateCartItemMutation();
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackError, setSnackError] = useState(false);
  const [snackStockLimit, setSnackStockLimit] = useState(false);

  const handleAddToCart = async () => {
    if (product.stock_avl === 0) {
      setSnackStockLimit(true);
      return;
    }

    try {
      if (isLoggedIn) {
        const existingItem = basket?.find(
          (item) => item.product_id === product.product_id
        );
        const updatedCount = existingItem ? existingItem.item_count + 1 : 1;

        if (updatedCount > product.stock_avl) {
          setSnackStockLimit(true);
          return;
        }

        await updateCartItem({
          loginid: userLoginId!,
          product_id: product.product_id,
          item_count: updatedCount,
          added_date: new Date().toISOString().split("T")[0],
        });
      } else {
        const guestCart: CartItem[] = getGuestCart();
        const existingItem = guestCart.find(
          (item) => item.product_id === product.product_id
        );

        const updatedCount = existingItem ? existingItem.item_count + 1 : 1;

        if (updatedCount > product.stock_avl) {
          setSnackStockLimit(true);
          return;
        }

        if (existingItem) {
          existingItem.item_count = updatedCount;
        } else {
          guestCart.push({
            cart_id: Date.now(),
            product_id: product.product_id,
            item_count: 1,
            added_date: new Date().toISOString().split("T")[0],
            product_name: product.product_name,
            MRP: product.MRP,
            product_image: product.product_image,
            discount: product.discount,
            stock_avl: product.stock_avl,
          });
        }

        saveGuestCart(guestCart);
      }

      setSnackOpen(true);
    } catch (err) {
      console.error("Add to cart failed:", err);
      setSnackError(true);
    }
  };

  return (
    <>
      <Card
        elevation={8}
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "rgba(17, 17, 17, 0.29)",
          backdropFilter: "blur(12px)",
        }}
      >
        <CardMedia
          sx={{
            height: { xs: 140, sm: 170, md: 200 },
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
          image={product.product_image}
          title={product.product_name}
        />
        <CardContent sx={{ px: 2, py: 1.2 }}>
          <Typography
            gutterBottom
            sx={{
              textTransform: "uppercase",
              fontSize: { xs: "0.85rem", sm: "0.95rem" },
              fontWeight: 600,
              color: "text.primary",
              lineHeight: 1.3,
            }}
          >
            {product.product_name}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "0.95rem", sm: "1.05rem" },
              color: "secondary.main",
              fontWeight: 700,
            }}
          >
            ₹{((product.MRP / 100) * (1 - product.discount / 100)).toFixed(2)}
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.85rem" },
              color: "text.secondary",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <s>₹{(product.MRP / 100).toFixed(2)}</s>
            <Typography
              component="span"
              color="secondary"
              fontWeight={600}
              fontSize={{ xs: "0.75rem", sm: "0.85rem" }}
            >
              ({product.discount.toFixed(0)}% OFF)
            </Typography>
          </Typography>
        </CardContent>

        <CardActions
          sx={{
            justifyContent: "space-between",
            px: 2,
            pb: 2,
          }}
        >
          {product.stock_avl > 0 ? (
            <Button
              variant="contained"
              onClick={handleAddToCart}
              sx={{
                backgroundColor: "rgba(39, 165, 194, 0.67)",
                color: "whitesmoke",
                fontWeight: 600,
                fontSize: { xs: "0.7rem", sm: "0.85rem" },
                px: 2,
                py: 0.6,
                minWidth: { xs: "45%", sm: "auto" },
              }}
            >
              Add
            </Button>
          ) : (
            <Typography
              sx={{
                color: "secondary.main",
                fontWeight: 600,
                fontSize: { xs: "0.75rem", sm: "0.9rem" },
              }}
            >
              Out of stock
            </Typography>
          )}

          <Button
            component={Link}
            to={`/catalog/${product.product_id}`}
            variant="contained"
            sx={{
              backgroundColor: "rgba(89, 28, 139, 0.63)",
              color: "whitesmoke",
              fontWeight: 600,
              fontSize: { xs: "0.7rem", sm: "0.85rem" },
              px: 2,
              py: 0.6,
              minWidth: { xs: "45%", sm: "auto" },
            }}
          >
            View
          </Button>
        </CardActions>
      </Card>

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
          sx={{
            width: "100%",
            fontSize: "1rem",
            py: 1,
            borderRadius: "10px",
          }}
        >
          Failed to add item to cart. Please try again!
        </Alert>
      </Snackbar>

      <Snackbar
        open={snackStockLimit}
        autoHideDuration={2000}
        onClose={() => setSnackStockLimit(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackStockLimit(false)}
          severity="warning"
          variant="filled"
          sx={{
            width: "100%",
            fontSize: "1rem",
            py: 1,
            borderRadius: "10px",
            backgroundColor: "secondary.main",
          }}
        >
          Maximum quantity in stock is reached
        </Alert>
      </Snackbar>
    </>
  );
}

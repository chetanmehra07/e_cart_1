import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../app/store/store";
import { Link } from "react-router-dom";

type BuyHistoryItem = {
  buy_id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  buy_date: string;
  delivery_address: string;
};

export default function BuyHistoryPage() {
  const login_id = useAppSelector((state) => state.account.user?.loginid);
  const [history, setHistory] = useState<BuyHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `https://e-cart-backend-yrbb.onrender.com/buy_history?login_id=${login_id}`
        );
        if (!res.ok) throw new Error("Failed to fetch buy history");
        const data = await res.json();
        setHistory(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (login_id) fetchHistory();
  }, [login_id]);

  return (
    <Container sx={{ mt: 6, mb: 4 }}>
      <Typography
        variant={isMobile ? "h5" : "h3"}
        gutterBottom
        textAlign="center"
        color="secondary"
        fontWeight="bold"
        mb={4}
      >
        Purchase History
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress color="secondary" />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : history.length === 0 ? (
        <Typography
          variant="body1"
          textAlign="center"
          mt={4}
          fontSize={{ xs: "1rem", sm: "1.2rem" }}
        >
          You haven’t purchased anything yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {history.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.buy_id}>
              <Link
                to={`/catalog/${item.product_id}`}
                style={{ textDecoration: "none" }}
              >
                <Card
                  sx={{
                    borderRadius: 2,
                    p: 1.2,
                    display: "flex",
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                    },
                    alignItems: {
                      xs: "flex-start",
                      sm: "center",
                    },
                    gap: 2,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    background: "rgba(135, 128, 138, 0.37)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: "0 6px 18px rgba(0, 0, 0, 0.3)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={item.product_image || "/placeholder.jpg"}
                    alt={item.product_name}
                    sx={{
                      width: { xs: "100%", sm: 100 },
                      height: { xs: 180, sm: 100 },
                      borderRadius: 2,
                      objectFit: "cover",
                      border: "2px solid rgba(253, 253, 253, 0.83)",
                      ml: { sm: 1 },
                    }}
                  />

                  <CardContent sx={{ p: 0, flex: 1 }}>
                    <Typography
                      variant="subtitle1"
                      fontSize={{ xs: "1rem", sm: "1.1rem" }}
                      fontWeight="bold"
                      color="secondary.main"
                      noWrap={!isMobile}
                      mb={0.5}
                    >
                      {item.product_name}
                    </Typography>

                    <Typography
                      variant="caption"
                      display="block"
                      fontSize={{ xs: "0.75rem", sm: "0.85rem" }}
                    >
                      <strong>Buy Date:</strong> {item.buy_date}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontSize={{ xs: "0.75rem", sm: "0.85rem" }}
                      fontStyle="italic"
                      sx={{ mt: 0.5, display: "block" }}
                    >
                      {item.delivery_address}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

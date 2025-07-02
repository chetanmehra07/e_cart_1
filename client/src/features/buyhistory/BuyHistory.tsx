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

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/buy_history?login_id=${login_id}`
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
    <Container sx={{ mt: 6 }}>
      <Typography
        variant="h3"
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
        <Typography variant="body1" textAlign="center" mt={4}>
          You haven’t purchased anything yet.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {history.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.buy_id}>
              <Link
                to={`/catalog/${item.product_id}`}
                style={{ textDecoration: "none" }}
              >
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    background: "rgba(135, 128, 138, 0.37)",
                    p: 1.2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    cursor: "pointer",
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
                      width: 100,
                      height: 100,
                      borderRadius: 2,
                      objectFit: "cover",
                      border: "2px solid rgba(253, 253, 253, 0.83) ",
                      ml: 1,
                    }}
                  />
                  <CardContent sx={{ p: 0, flex: 1 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="secondary.main"
                      noWrap
                    >
                      {item.product_name}
                    </Typography>
                    <Typography variant="caption">
                      <strong>Buy Date:</strong> {item.buy_date}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "text.secondary",
                        mt: 0.5,
                        fontStyle: "italic",
                      }}
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

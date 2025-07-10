import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/store/store";

type UserAddress = {
  address_id: number;
  login_id: number;
  address_part1: string;
  address_part2: string;
  city: string;
  state: string;
  nation: string;
  pincode: string;
  landmark?: string;
};

export default function AddressPage() {
  const { user } = useAppSelector((state) => state.account);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.loginid) return;

      try {
        const res = await fetch(
          `https://e-cart-backend-yrbb.onrender.com/user_address/get?login_id=${user.loginid}`
        );
        const data = await res.json();
        setAddresses(data);
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [user]);

  const handleRemove = async (address_id: number) => {
    try {
      const response = await fetch(
        `https://e-cart-backend-yrbb.onrender.com/user_address/delete?address_id=${address_id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete address");

      setAddresses((prev) =>
        prev.filter((address) => address.address_id !== address_id)
      );
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: { xs: 6, sm: 10 },
        px: { xs: 1.5, sm: 3 },
        overflowX: "hidden",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 3,
          backgroundColor: "background.paper",
          boxShadow: 4,
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          textAlign="center"
          gutterBottom
          color="secondary"
          fontWeight="bold"
        >
          Saved Addresses
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {loading ? (
          <Box textAlign="center" mt={2}>
            <CircularProgress color="secondary" />
          </Box>
        ) : addresses.length === 0 ? (
          <Typography
            textAlign="center"
            color="text.secondary"
            variant={isMobile ? "body1" : "h6"}
          >
            No addresses found for your account.
          </Typography>
        ) : (
          addresses.map((address) => (
            <Paper
              key={address.address_id}
              sx={{
                p: { xs: 1.5, sm: 2 },
                mb: 2,
                borderRadius: 2,
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexDirection: { xs: "column", sm: "row" },
                gap: 1,
              }}
            >
              <Box>
                <Typography fontWeight="bold">
                  {address.address_part1}, {address.address_part2}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {address.city}, {address.state}, {address.nation} -{" "}
                  {address.pincode}
                  {address.landmark && ` | Landmark: ${address.landmark}`}
                </Typography>
              </Box>

              <Button
                variant="outlined"
                color="secondary"
                size="small"
                sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
                onClick={() => handleRemove(address.address_id)}
              >
                🗑️ Remove
              </Button>
            </Paper>
          ))
        )}

        {/* Add Address / Back Button */}
        <Box
          mt={4}
          display="flex"
          justifyContent="center"
          flexWrap="wrap"
          gap={2}
        >
          <Button
            variant="outlined"
            color="secondary"
            component={Link}
            to="/profile"
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/add-address"
            state={{ from: "/address" }}
          >
            + Add Address
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

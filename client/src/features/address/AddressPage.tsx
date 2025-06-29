// src/pages/AddressPage.tsx

import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Divider,
  CircularProgress,
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

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.loginid) return;

      try {
        const res = await fetch(
          `http://localhost:8000/user_address/get?login_id=${user.loginid}`
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
        `http://localhost:8000/user_address/delete?address_id=${address_id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete address");

      // Remove the deleted address from state
      setAddresses((prev) =>
        prev.filter((address) => address.address_id !== address_id)
      );
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 3,
          background: "secondary",
          backdropFilter: "blur(6px)",
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          gutterBottom
          color="secondary"
        >
          Saved Addresses
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {loading ? (
          <Box textAlign="center" mt={2}>
            <CircularProgress color="secondary" />
          </Box>
        ) : addresses.length === 0 ? (
          <Typography textAlign="center" color="text.secondary">
            No addresses found for your account.
          </Typography>
        ) : (
          addresses.map((address) => (
            <Paper
              key={address.address_id}
              sx={{
                p: 2,
                mb: 2,
                backgroundColor: "secondary",
                borderRadius: 2,
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
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
                sx={{ mt: { xs: 1, sm: 0 } }}
                onClick={() => handleRemove(address.address_id)}
              >
                🗑️ Remove
              </Button>
            </Paper>
          ))
        )}

        {/* Add Address Button */}
        <Box
          mt={4}
          display="flex"
          justifyContent="center"
          gap={2}
          flexWrap="wrap"
        >
          <Button
            variant="outlined"
            color="secondary"
            component={Link}
            to="/profile" // you can change this to wherever "Back" should go
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

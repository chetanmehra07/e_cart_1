// src/pages/UserProfilePage.tsx

import {
  Box,
  Container,
  Divider,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/store";
import { logoutUser } from "../account/accountSlice";

type UserProfile = {
  UserName: string;
  first_name: string;
  last_name: string;
  emailaddress: string;
  phoneNo: string;
  password: string;
  DateOfBirth: string;
  gender: string;
  address: number | null;
};

export default function UserProfilePage() {
  const { user } = useAppSelector((state) => state.account);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.loginid) {
      fetch(
        `https://e-cart-backend-yrbb.onrender.com/login/info?loginid=${user.loginid}`
      )
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch profile");
          return res.json();
        })
        .then((data) => {
          setProfile(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Typography variant="h6" textAlign="center">
          Loading profile...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: "secondary",
          backdropFilter: "blur(4px)",
        }}
      >
        <Typography variant="h4" textAlign="center" gutterBottom>
          Profile Information
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {profile &&
          Object.entries(profile)
            .filter(([key]) => key !== "password" && key !== "address")
            .map(([key, value]) => (
              <Box
                key={key}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 3,
                  px: 1,
                }}
              >
                <Typography fontWeight="bold" color="secondary">
                  {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                </Typography>
                <Typography color="text.secondary">{String(value)}</Typography>
              </Box>
            ))}

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => navigate("/address")}
          >
            Address
          </Button>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

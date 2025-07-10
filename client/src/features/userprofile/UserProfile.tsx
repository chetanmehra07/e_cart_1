import {
  Box,
  Container,
  Divider,
  Paper,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    <Container maxWidth="sm" sx={{ mt: { xs: 6, sm: 10 }, px: { xs: 2 } }}>
      <Paper
        elevation={6}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          backgroundColor: "secondary",
          backdropFilter: "blur(4px)",
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          textAlign="center"
          gutterBottom
          fontWeight="bold"
          color="secondary"
        >
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
                  alignItems: "center",
                  mb: 2,
                  px: 1,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  fontWeight="bold"
                  color="secondary"
                  sx={{ fontSize: { xs: "0.9rem", sm: "1rem" }, mr: 1 }}
                >
                  {key.replace(/([A-Z])/g, " $1").toUpperCase()}:
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "0.7rem", sm: "1rem" },
                    wordBreak: "break-word",
                    textAlign: "right",
                    flex: 1,
                  }}
                >
                  {String(value)}
                </Typography>
              </Box>
            ))}

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
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

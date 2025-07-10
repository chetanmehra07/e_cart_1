import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/store/store";
import type { SelectChangeEvent } from "@mui/material";

type StateType = {
  state_id: number;
  statename: string;
};

export default function AddAddressPage() {
  const { user } = useAppSelector((state) => state.account);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/address";

  const [form, setForm] = useState({
    address_part1: "",
    address_part2: "",
    city: "",
    state: "",
    nation: "",
    pincode: "",
    landmark: "",
  });

  const [states, setStates] = useState<StateType[]>([]);
  const [loadingStates, setLoadingStates] = useState(true);

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    success: true,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch(
          "https://e-cart-backend-yrbb.onrender.com/states/all"
        );
        const data = await res.json();
        setStates(data);
      } catch (error) {
        console.error("Failed to fetch states", error);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setForm({ ...form, [e.target.name!]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!user?.loginid) return;

    const payload = {
      ...form,
      login_id: user.loginid,
      state: parseInt(form.state),
    };

    try {
      const res = await fetch(
        "https://e-cart-backend-yrbb.onrender.com/user_address/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to add address");

      setSnack({
        open: true,
        message: "✅ Address added successfully!",
        success: true,
      });

      setTimeout(() => navigate(from), 1500);
    } catch (error) {
      console.error(error);
      setSnack({
        open: true,
        message: "❌ Failed to add address",
        success: false,
      });
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: { xs: 6, sm: 10 },
        px: { xs: 1.5, sm: 2 },
        overflowX: "hidden",
      }}
    >
      <Paper
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          backgroundColor: "background.paper",
          boxShadow: 4,
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          gutterBottom
          textAlign="center"
          color="secondary"
          fontWeight="bold"
        >
          Add New Address
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Address Line 1"
            name="address_part1"
            fullWidth
            onChange={handleChange}
          />
          <TextField
            label="Address Line 2"
            name="address_part2"
            fullWidth
            onChange={handleChange}
          />
          <TextField
            label="City"
            name="city"
            fullWidth
            onChange={handleChange}
          />

          <FormControl fullWidth>
            <InputLabel>State</InputLabel>
            <Select
              name="state"
              value={form.state}
              label="State"
              onChange={handleSelectChange}
            >
              {loadingStates ? (
                <MenuItem disabled>Loading...</MenuItem>
              ) : (
                states.map((s) => (
                  <MenuItem key={s.state_id} value={s.state_id.toString()}>
                    {s.statename}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <TextField
            label="Nation"
            name="nation"
            fullWidth
            onChange={handleChange}
          />
          <TextField
            label="Pincode"
            name="pincode"
            fullWidth
            onChange={handleChange}
          />
          <TextField
            label="Landmark (optional)"
            name="landmark"
            fullWidth
            onChange={handleChange}
          />

          <Button
            variant="contained"
            color="secondary"
            sx={{
              mt: 2,
              fontWeight: "bold",
              py: 1.2,
              fontSize: isMobile ? "0.9rem" : "1rem",
            }}
            onClick={handleSubmit}
          >
            ➕ Add Address
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snack.success ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

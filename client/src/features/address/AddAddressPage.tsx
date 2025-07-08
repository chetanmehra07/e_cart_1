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
  const from = location.state?.from || "/address"; // default redirect

  const [form, setForm] = useState({
    address_part1: "",
    address_part2: "",
    city: "",
    state: "", // we'll use state_id (string) here, convert before sending
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
      state: parseInt(form.state), // backend expects int
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
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper sx={{ p: 4, borderRadius: 3, background: "secondary" }}>
        <Typography
          variant="h4"
          gutterBottom
          textAlign="center"
          color="secondary"
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
            sx={{ mt: 2, fontWeight: "bold" }}
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

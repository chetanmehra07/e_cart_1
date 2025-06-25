import {
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUser } from "../account/accountSlice";
import { useAppDispatch } from "../../app/store/store";

export default function LoginPage() {
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [snackSuccess, setSnackSuccess] = useState(false);
  const [userName, setUserName] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    try {
      const response = await fetch("http://localhost:8000/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNo, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError(errorText || "Login failed");
        return;
      }

      const data = await response.json(); // { loginid: 1, UserName: "Chetan" }

      if (!data.loginid || !data.UserName) {
        setError("Invalid response from server.");
        return;
      }

      dispatch(setUser({ loginid: data.loginid, UserName: data.UserName }));
      setUserName(data.UserName);
      setSnackSuccess(true);

      setTimeout(() => {
        navigate("/catalog");
      }, 2000);
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" mb={3} textAlign="center">
          Login to Re-Store
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Phone Number"
          fullWidth
          margin="normal"
          value={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
          sx={{
            "& label.Mui-focused": { color: "secondary.main" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderWidth: "2px" },
              "&.Mui-focused fieldset": {
                borderColor: "secondary.main",
                borderWidth: "2px",
              },
            },
          }}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            "& label.Mui-focused": { color: "secondary.main" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderWidth: "2px" },
              "&.Mui-focused fieldset": {
                borderColor: "secondary.main",
                borderWidth: "2px",
              },
            },
          }}
        />

        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>
        <Typography variant="body2" textAlign="center" sx={{ mt: 3 }}>
          Don't have an account?{" "}
          <span
            style={{ color: "#9c27b0", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </Typography>
      </Paper>

      {/* ✅ Success Snackbar */}
      <Snackbar
        open={snackSuccess}
        autoHideDuration={3000}
        onClose={() => setSnackSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackSuccess(false)}
          severity="success"
          variant="filled"
          sx={{
            width: "100%",
            fontSize: "1rem",
            py: 1,
            borderRadius: "5px",
            backgroundColor: "secondary.main",
          }}
        >
          Hi, {userName}!
        </Alert>
      </Snackbar>
    </Container>
  );
}

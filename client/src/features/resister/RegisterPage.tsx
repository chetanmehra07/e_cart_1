import {
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import type { SelectChangeEvent } from "@mui/material";

type RegisterFormData = {
  UserName: string;
  first_name: string;
  last_name: string;
  emailaddress: string;
  phoneNo: string;
  password: string;
  DateOfBirth: string;
  gender: string;
};

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    UserName: "",
    first_name: "",
    last_name: "",
    emailaddress: "",
    phoneNo: "",
    password: "",
    DateOfBirth: "",
    gender: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email: string) => /^[^\s@]+@gmail\.com$/.test(email);
  const isValidPhone = (phone: string) => /^[0-9]{10}$/.test(phone);

  const getPasswordStrength = (password: string) => {
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/.test(password))
      return "Strong";
    if (/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password)) return "Medium";
    if (password.length < 6) return "Weak";
    return "Weak";
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch =
    formData.password.length > 0 && formData.password === confirmPassword;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (e: SelectChangeEvent<string>) => {
    setFormData({ ...formData, gender: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");

    const isEmpty = Object.entries(formData).some(
      ([, value]) => value.trim() === ""
    );
    if (isEmpty || confirmPassword.trim() === "") {
      setError("All fields are required.");
      return;
    }

    if (!isValidEmail(formData.emailaddress)) {
      setError("Email must be a valid @gmail.com address.");
      return;
    }

    if (!isValidPhone(formData.phoneNo)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        "https://e-cart-backend-yrbb.onrender.com/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        setError(errText || "Registration failed");
        return;
      }

      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      setError("Something went wrong during registration.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Register for Re-Store
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Registration successful! Redirecting to login...
          </Alert>
        )}

        <Grid container spacing={2}>
          {/* Username */}
          <Grid item xs={12}>
            <TextField
              label="Username"
              name="UserName"
              fullWidth
              required
              value={formData.UserName}
              onChange={handleChange}
              sx={textFieldStyles}
            />
          </Grid>

          {/* Set Password */}
          <Grid item xs={12}>
            <TextField
              label="Set Password"
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      sx={{ p: "4px", mr: "6px" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={textFieldStyles}
            />
            {formData.password.length > 0 && (
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  borderRadius: 1,
                  color:
                    passwordStrength === "Weak"
                      ? "#d32f2f"
                      : passwordStrength === "Medium"
                      ? "#f57c00"
                      : "#2e7d32",
                }}
              >
                Password Strength: {passwordStrength}
              </Typography>
            )}
          </Grid>

          {/* Confirm Password */}
          <Grid item xs={12}>
            <TextField
              label="Re-enter Password"
              type={showConfirmPassword ? "text" : "password"}
              fullWidth
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={confirmPassword.length > 0 && !passwordsMatch}
              helperText={
                confirmPassword.length > 0 && !passwordsMatch
                  ? "Passwords do not match"
                  : ""
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      edge="end"
                      sx={{ p: "4px", mr: "6px" }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={textFieldStyles}
            />
          </Grid>

          {/* First Name / Last Name */}
          <Grid item xs={6}>
            <TextField
              label="First Name"
              name="first_name"
              fullWidth
              required
              value={formData.first_name}
              onChange={handleChange}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Last Name"
              name="last_name"
              fullWidth
              required
              value={formData.last_name}
              onChange={handleChange}
              sx={textFieldStyles}
            />
          </Grid>

          {/* Email / Phone */}
          <Grid item xs={6}>
            <TextField
              label="Email Address"
              name="emailaddress"
              type="email"
              fullWidth
              required
              value={formData.emailaddress}
              onChange={handleChange}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Phone Number"
              name="phoneNo"
              type="tel"
              fullWidth
              required
              value={formData.phoneNo}
              onChange={handleChange}
              sx={textFieldStyles}
            />
          </Grid>

          {/* Date of Birth / Gender side by side */}
          <Grid item xs={6}>
            <TextField
              label="Date of Birth"
              name="DateOfBirth"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={formData.DateOfBirth}
              onChange={handleChange}
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth required sx={textFieldStyles}>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                name="gender"
                value={formData.gender}
                label="Gender"
                onChange={handleGenderChange}
              >
                <MenuItem value={"Male"}>Male</MenuItem>
                <MenuItem value={"Female"}>Female</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => navigate("/address")}
            >
              Add Address
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleSubmit}
              disabled={!passwordsMatch}
            >
              Register
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

const textFieldStyles = {
  "& label.Mui-focused": {
    color: "secondary.main",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderWidth: "2px",
    },
    "&.Mui-focused fieldset": {
      borderColor: "secondary.main",
      borderWidth: "2px",
    },
  },
};

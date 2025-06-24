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
  type SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (e: SelectChangeEvent) => {
    setFormData({ ...formData, gender: e.target.value });
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@gmail\.com$/.test(email);
  };

  const isValidPhone = (phone: string) => {
    return /^[0-9]{10}$/.test(phone);
  };

  const handleSubmit = async () => {
    setError("");

    // 1. Check empty fields
    const isEmpty = Object.entries(formData).some(
      ([, value]) => value.trim() === ""
    );
    if (isEmpty) {
      setError("All fields are required.");
      return;
    }

    // 2. Validate email
    if (!isValidEmail(formData.emailaddress)) {
      setError("Email must be a valid @gmail.com address.");
      return;
    }

    // 3. Validate phone number
    if (!isValidPhone(formData.phoneNo)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

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
    <Container maxWidth="sm" sx={{ mt: 10 }}>
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
          {[
            { name: "UserName", label: "Username" },
            { name: "first_name", label: "First Name" },
            { name: "last_name", label: "Last Name" },
            {
              name: "emailaddress",
              label: "Email Address",
              type: "email",
            },
            {
              name: "phoneNo",
              label: "Phone Number",
              type: "tel",
            },
            {
              name: "password",
              label: "Password",
              type: "password",
            },
            {
              name: "DateOfBirth",
              label: "Date of Birth",
              type: "date",
            },
          ].map(({ name, label, type = "text" }) => (
            <Grid item xs={12} key={name}>
              <TextField
                name={name}
                label={label}
                type={type}
                fullWidth
                required
                value={formData[name as keyof RegisterFormData]}
                onChange={handleChange}
                InputLabelProps={type === "date" ? { shrink: true } : undefined}
                sx={{
                  "& label.Mui-focused": {
                    color: "secondary.main",
                    borderWidth: "2px", // Purple label on focus
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderWidth: "2px",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "secondary.main",
                      borderWidth: "2px", // Purple border on focus
                    },
                  },
                }}
              />
            </Grid>
          ))}

          {/* Gender Dropdown */}
          <Grid item xs={12}>
            <FormControl
              fullWidth
              required
              sx={{
                "& label.Mui-focused": {
                  color: "secondary.main",
                  borderWidth: "2px", // Purple label on focus
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderWidth: "2px",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "secondary.main",
                    borderWidth: "2px", // Purple border on focus
                  },
                },
              }}
            >
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

        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          Register
        </Button>
      </Paper>
    </Container>
  );
}

import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderWidth: "2px",
    },
    "&:hover fieldset": {
      borderColor: "rgb(175, 86, 220)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgb(192, 126, 225)",
    },
  },
  "& label.Mui-focused": {
    color: "rgb(192, 126, 225)",
  },
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://e-cart-backend-yrbb.onrender.com/contact/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        setOpenSnackbar(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setErrorSnackbar(true);
      }
    } catch (err) {
      console.error("Submission error:", err);
      setErrorSnackbar(true);
    }
  };

  return (
    <Box>
      <Container maxWidth="xl">
        <Paper
          elevation={9}
          sx={{
            p: 6,
            borderRadius: "2rem",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Header */}
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{
              fontFamily: "'Dancing Script', cursive",
              fontWeight: 700,
              color: "secondary.main",
            }}
          >
            Contact Us
          </Typography>

          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            gutterBottom
          >
            We'd love to hear from you. Feel free to reach out with any
            questions, feedback, or just a friendly hello!
          </Typography>

          <Divider sx={{ my: 4 }} />

          {/* Contact Form */}
          <Box
            sx={{
              background: "rgba(159, 150, 164, 0.32)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
              borderRadius: 4,
              p: { xs: 3, md: 5 },
            }}
          >
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Your Name"
                    variant="outlined"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    sx={inputStyles}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Your Email"
                    variant="outlined"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    sx={inputStyles}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="subject"
                    label="Subject"
                    variant="outlined"
                    value={formData.subject}
                    onChange={handleChange}
                    sx={inputStyles}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="message"
                    label="Your Message"
                    multiline
                    rows={5}
                    variant="outlined"
                    value={formData.message}
                    onChange={handleChange}
                    sx={inputStyles}
                  />
                </Grid>
                <Grid item xs={12} textAlign="center">
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      bgcolor: "white",
                      color: "#6a1b9a",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      borderRadius: "20px",
                      px: 4,
                      py: 1.3,
                      textTransform: "none",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.85)",
                        boxShadow: "0 0 10px 4px rgba(196, 127, 239, 0.55)",
                      },
                    }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Footer */}
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 4 }}
          >
            &copy; {new Date().getFullYear()} RE-STORE by Chetan Mehra. All
            rights reserved.
          </Typography>
        </Paper>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          variant="filled"
          sx={{
            width: "600px", // custom width for the alert box
            fontSize: "1.2rem",
            py: 1.8,
            borderRadius: "10px",
          }}
        >
          Message sent successfully!
        </MuiAlert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={errorSnackbar}
        autoHideDuration={4000}
        onClose={() => setErrorSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setErrorSnackbar(false)}
          severity="error"
          variant="filled"
          sx={{
            width: "600px", // custom width for the alert box
            fontSize: "1.2rem",
            py: 1.8,
            borderRadius: "10px",
          }}
        >
          Failed to send message. Please try again!
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default ContactPage;

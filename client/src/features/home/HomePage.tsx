import { Box, Typography, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import shoppingimg from "../../assets/shoppingimg.png";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        maxWidth: "xl",
        minHeight: "79vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, md: 8 },
        py: 6,
        background: "rgba(135, 128, 138, 0.37)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: "30px",
        boxShadow: "0 8px 12px 0 rgba(0, 0, 0, 0.37)",
        m: 3,
        mb: 0,
      }}
    >
      <Grid container spacing={4} alignItems="center">
        {/* Left Text */}
        <Grid item xs={12} md={6}>
          <Typography
            fontSize="2.5rem"
            fontWeight="bold"
            fontFamily={"cursive"}
            color="secondary"
            sx={{ mb: "-0.5rem" }}
          >
            Welcome to
          </Typography>
          <Typography
            fontSize="4.2rem"
            fontWeight="bold"
            fontFamily={"cursive"}
            color="secondary"
            sx={{ mb: "0.5rem" }}
          >
            Re-Store !
          </Typography>
          <Typography
            variant="body1"
            sx={{
              maxWidth: "600",
              textAlign: "justify",
              textJustify: "inter-word",
            }}
            paragraph
          >
            At Re-Store, we bring you the best in electronics from powerful
            laptops to the latest smartphones and gadgets. Shop smart, save
            more, and enjoy reliable tech delivered to your doorstep.
          </Typography>

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate("/catalog")}
              sx={{
                bgcolor: "white",
                color: "rgb(130, 38, 196)",
                fontWeight: "bold",
                fontSize: "1.2rem",
                borderRadius: "15px",
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
              Shop Now
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/about")}
              sx={{
                color: "rgb(233, 234, 231)",
                borderColor: "rgb(233, 234, 231)",
                backgroundColor: "rgba(175, 169, 177, 0.49)",
                borderWidth: "2.5px",
                fontWeight: "bold",
                borderRadius: "15px",
                fontSize: "1.25rem",
                px: 4,
                py: 1.3,
                textTransform: "none",
                "&:hover": {
                  borderColor: "#ddd",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 0 10px 4px rgba(230, 227, 232, 0.36)",
                },
              }}
            >
              About us
            </Button>
          </Box>
        </Grid>

        {/* Right Image */}
        <Grid item xs={12} md={6} textAlign="center">
          <Box
            component="img"
            src={shoppingimg}
            alt="Online Shopping"
            sx={{
              ml: "4.5rem",
              width: "100%",
              maxWidth: 490,
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

import {
  Box,
  Typography,
  Container,
  Divider,
  Button,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

type SectionBlockProps = {
  title: string;
  icon?: string;
  children: React.ReactNode;
};

// Reusable section block
const SectionBlock = ({ title, icon, children }: SectionBlockProps) => (
  <Box
    sx={{
      textAlign: "center",
      p: { xs: 2, sm: 4, md: 5 },
      borderRadius: 4,
      background: "rgba(159, 150, 164, 0.32)",
      backdropFilter: "blur(12px)",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
      mb: { xs: 3, sm: 4 },
    }}
  >
    <Typography
      variant="h4"
      sx={{
        fontSize: { xs: "1.5rem", sm: "2rem" },
        fontWeight: 700,
        color: "#bf6be7",
        mb: 2,
      }}
    >
      {icon} {title}
    </Typography>
    <Typography
      variant="body1"
      sx={{
        margin: "auto",
        fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.2rem" },
        maxWidth: "lg",
        textAlign: "justify",
        textJustify: "inter-word",
        hyphens: "auto",
      }}
    >
      {children}
    </Typography>
  </Box>
);

const AboutPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 4 } }}>
        <Paper
          elevation={9}
          sx={{
            p: { xs: 3, sm: 4, md: 6 },
            borderRadius: "2rem",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
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
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            RE-STORE
          </Typography>

          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            gutterBottom
            sx={{ fontSize: { xs: "0.95rem", sm: "1.1rem" } }}
          >
            Your trusted destination for premium electronic gadgets and
            accessories.
          </Typography>

          <Divider sx={{ my: { xs: 3, sm: 4 } }} />

          {/* Our Mission */}
          <SectionBlock title="Our Mission">
            At <b>RE-STORE</b>, we’re passionate about providing high-quality
            electronic products at the best prices. Whether you're a tech geek,
            a gamer, or just someone looking for reliable gadgets — we’ve got
            something for everyone.
            <br />
            <br />
            We believe that technology should be empowering, accessible, and
            affordable. That’s why every product we list is handpicked for its
            performance, durability, and value.
            <br />
            <br />
            Our goal isn’t just to sell gadgets — it’s to build a community of
            tech-savvy users who appreciate quality, innovation, and
            transparency. From headphones that immerse you in music to smart
            devices that make your life easier — RE-STORE helps you discover
            what’s next.
            <br />
            <br />
            With secure checkout, fast delivery, and responsive support, we make
            shopping seamless and satisfying.
            <br />
            <br />
            RE-STORE is not just a store; it’s a journey where innovation meets
            integrity. From eco-conscious packaging to reliable human support,
            we’re redefining what it means to be a modern brand.
          </SectionBlock>

          {/* Side-by-Side on Desktop, Stack on Mobile */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <SectionBlock title="Why Choose Us?">
                Discover why thousands of customers love shopping with us:
                <ul style={{ textAlign: "left", paddingInlineStart: "1rem" }}>
                  <li>Handpicked premium electronics</li>
                  <li>Fast and safe delivery</li>
                  <li>Responsive support team</li>
                </ul>
              </SectionBlock>
            </Grid>

            <Grid item xs={12} md={6}>
              <SectionBlock title="What’s Next">
                We’re working hard to enhance your shopping experience with:
                <ul style={{ textAlign: "left", paddingInlineStart: "1rem" }}>
                  <li>AI-based product recommendations</li>
                  <li>Real-time order tracking</li>
                  <li>24x7 chatbot support</li>
                </ul>
              </SectionBlock>
            </Grid>
          </Grid>

          {/* Author Section */}
          <SectionBlock title="Author">
            This e-commerce platform was crafted by <b>Chetan Mehra</b> using a
            powerful, modern tech stack:
            <br />
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <li>
                <b>React</b> – Fast and responsive frontend
              </li>
              <li>
                <b>FastAPI</b> – Modern, high-performance backend API
              </li>
              <li>
                <b>MySQL</b> – Secure and scalable data storage
              </li>
              <li>
                <b>Python</b> – Clean and efficient backend logic
              </li>
            </ul>
          </SectionBlock>

          {/* Call to Action */}
          <Box textAlign="center" sx={{ mt: { xs: 3, sm: 4 } }}>
            <Button
              variant="contained"
              color="secondary"
              size={isMobile ? "medium" : "large"}
              onClick={() => navigate("/catalog")}
              sx={{
                fontWeight: 500,
                fontSize: { xs: "0.95rem", sm: "1.1rem" },
                borderRadius: 3,
                px: 4,
                py: 1.2,
              }}
            >
              Explore Our Products
            </Button>
          </Box>

          <Divider sx={{ my: { xs: 3, sm: 4 } }} />

          {/* Footer */}
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: { xs: 2, sm: 3 } }}
          >
            &copy; {new Date().getFullYear()} RE-STORE by Chetan Mehra. All
            rights reserved.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default AboutPage;

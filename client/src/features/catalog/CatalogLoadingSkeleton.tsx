import { Box, Skeleton, Paper, useMediaQuery, useTheme } from "@mui/material";
import FakeProgressBar from "./FakeProgressBar";
import PollCard from "./pollcard";

export default function CatalogLoadingSkeleton() {
  const skeletonArray = Array.from({ length: 8 });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        overflow: "hidden", // 🚫 no scrollbars
        px: { xs: 1, sm: 2, md: 3 },
        pt: 0,
        backgroundColor: "transparent",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      {/* Fake progress bar under navbar */}
      <Box
        sx={{
          position: "fixed",
          top: 14,
          left: 0,
          right: 0,
          zIndex: 999,
        }}
      >
        <FakeProgressBar />
      </Box>

      {/* 💻 Skeletons only visible on tablet/desktop and go behind the PollCard */}
      {!isMobile && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            px: 2,
            pt: 14,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 3,
            opacity: 0.25,
            filter: "blur(2px)",
            pointerEvents: "none", // ❗ allow click-through
            zIndex: 1, // 👈 behind the poll
          }}
        >
          {skeletonArray.map((_, i) => (
            <Paper
              key={i}
              sx={{
                width: 260,
                height: 240,
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 8px 20px rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Skeleton
                variant="rectangular"
                width="100%"
                height={140}
                sx={{ borderRadius: 2 }}
                animation="wave"
              />
              <Skeleton
                width="90%"
                height={20}
                sx={{ mt: 2 }}
                animation="wave"
              />
              <Skeleton width="70%" height={18} animation="wave" />
              <Skeleton
                width="85%"
                height={25}
                sx={{ mt: 2 }}
                animation="wave"
              />
            </Paper>
          ))}
        </Box>
      )}

      {/* 📌 PollCard on top */}
      <Box
        sx={{
          width: { xs: "100%", sm: "75%", md: "45%" },
          zIndex: 2,
        }}
      >
        <PollCard />
      </Box>
    </Box>
  );
}

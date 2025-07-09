import { Box, Skeleton, Paper } from "@mui/material";
import FakeProgressBar from "./FakeProgressBar";
import PollCard from "./pollcard";

export default function CatalogLoadingSkeleton() {
  const skeletonArray = Array.from({ length: 8 });

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "60vh",
        mt: 8,
        px: { xs: 1, sm: 2, md: 3 }, // minimal horizontal padding
        backgroundColor: "transparent",
      }}
    >
      {/* Fake Progress Bar under navbar */}
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

      {/* Ghosted product skeletons */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 3,
          opacity: 0.7,
          filter: "blur(1px)",
          maxWidth: "300%",
          mx: "auto",
        }}
      >
        {skeletonArray.map((_, i) => (
          <Paper
            key={i}
            sx={{
              width: 320,
              height: 250,
              borderRadius: 3,

              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "0 8px 20px rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Skeleton
              variant="rectangular"
              width="100%"
              height={150}
              sx={{ borderRadius: 2 }}
              animation="wave"
            />
            <Skeleton
              width="100%"
              height={18}
              sx={{ mt: 2 }}
              animation="wave"
            />
            <Skeleton width="70%" height={20} animation="wave" />
            <Skeleton width="90%" height={30} sx={{ mt: 2 }} animation="wave" />
          </Paper>
        ))}
      </Box>

      {/* Centered PollCard */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          width: { xs: "90%", sm: "60%", md: "40%" },
        }}
      >
        <PollCard />
      </Box>
    </Box>
  );
}

import { Box, LinearProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function FakeProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    const delay = setTimeout(() => {
      timer = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 100 : prev + 5));
      }, 600);
    }, 2000);

    return () => {
      clearTimeout(delay);
      clearInterval(timer);
    };
  }, []);

  return (
    <Box
      sx={{
        width: "100%",

        mt: { xs: 4, sm: 4, md: 4 },
      }}
    >
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: 5,
          backgroundColor: "#e0e0e0",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "secondary.main",
          },
        }}
      />
      <Typography
        align="center"
        variant="caption"
        sx={{
          mt: 1,
          display: "block",
          color: "text.secondary",
          fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
        }}
      >
        Loading {progress}% – getting your perfect products ready! 🧺
      </Typography>
    </Box>
  );
}

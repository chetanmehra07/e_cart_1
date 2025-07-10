import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Fade,
  Divider,
  Box,
} from "@mui/material";

// Original list
const pollQuestions = [
  {
    question: "🛒 What’s most important to you while shopping online?",
    options: ["💰 Big Discounts", "🚚 Fast Delivery", "🔁 Easy Returns"],
  },
  {
    question: "📦 Which categories do you shop the most?",
    options: ["📱 Electronics", "👕 Clothing", "🏠 Home & Kitchen"],
  },
  {
    question: "🤝 Would you recommend us to a friend?",
    options: ["✅ Absolutely!", "🤔 Maybe", "🙁 Not yet"],
  },
  {
    question: "🌟 How’s your experience so far?",
    options: ["😎 Smooth & easy!", "😐 Could be better", "🧐 Still exploring"],
  },
  {
    question: "🔍 How do you usually discover new products?",
    options: ["📱 Social Media", "🔎 Search Engines", "👫 Recommendations"],
  },
  {
    question: "🚀 Which feature would you love to see next?",
    options: ["📝 Wishlist", "💬 Live Chat Support", "👗 Try Before You Buy"],
  },
  {
    question: "🆕 What do you expect from a new e-commerce site?",
    options: [
      "⭐ Trustworthy Reviews",
      "⚡ Fast Checkout",
      "🎁 Exciting Offers",
    ],
  },
  {
    question: "🕒 How often do you shop online?",
    options: ["📅 Weekly", "🗓️ Monthly", "🎉 Occasionally"],
  },
  {
    question: "🎯 What kind of offers catch your attention?",
    options: ["🎉 Buy 1 Get 1", "🔖 Flat % Off", "💸 Cashback Deals"],
  },
  {
    question: "📣 How did you hear about us?",
    options: ["👨‍👩‍👧‍👦 Friend/Family", "📲 Social Media", "🌐 I just found you!"],
  },
];

function shuffleArray(array: typeof pollQuestions) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function PollCard() {
  const [shuffledQuestions, setShuffledQuestions] = useState<
    typeof pollQuestions
  >([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showThanks, setShowThanks] = useState(false);

  useEffect(() => {
    setShuffledQuestions(shuffleArray(pollQuestions));
  }, []);

  const currentQuestion = shuffledQuestions[questionIndex];

  const handleSelect = (option: string) => {
    setSelected(option);
    setTimeout(() => {
      if (questionIndex < shuffledQuestions.length - 1) {
        setQuestionIndex((prev) => prev + 1);
        setSelected(null);
      } else {
        setShowThanks(true);
      }
    }, 1000);
  };

  return (
    <Card
      sx={{
        mt: 3,
        mx: "auto",
        width: "100%",
        maxWidth: { xs: "95%", sm: 420 },
        borderRadius: 3,
        bgcolor: "rgba(125, 123, 123, 0.29)",
        backdropFilter: "blur(12px)",
        p: { xs: 2, sm: 2.5 },
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      }}
    >
      <CardContent>
        <Fade in>
          <Box mb={2}>
            <Typography
              variant="h6"
              color="secondary"
              gutterBottom
              sx={{ fontSize: { xs: "1.1rem", sm: "1.2rem" } }}
            >
              👋 Hey! We’re just getting started…
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.95rem", sm: "1rem" } }}
            >
              As a new e-commerce platform, your opinion really helps us improve
              your shopping experience. Could you take a moment to share?
            </Typography>
          </Box>
        </Fade>

        <Divider sx={{ mb: 2 }} />

        {!showThanks && currentQuestion ? (
          <>
            <Fade in>
              <Typography
                variant="body1"
                fontWeight={500}
                mb={1}
                sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}
              >
                {currentQuestion.question}
              </Typography>
            </Fade>

            <Stack direction="column" spacing={2}>
              {currentQuestion.options.map((opt) => (
                <Button
                  key={opt}
                  variant="contained"
                  onClick={() => handleSelect(opt)}
                  color="secondary"
                  disabled={!!selected}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: { xs: "0.95rem", sm: "1.01rem" },
                    background: "secondary.main",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "#fff",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: "rgba(255, 255, 255, 0.25)",
                    },
                    "&:disabled": {
                      opacity: 0.6,
                      cursor: "not-allowed",
                    },
                  }}
                >
                  {opt}
                </Button>
              ))}
            </Stack>

            {selected && (
              <Typography
                mt={2}
                variant="body2"
                color="secondary"
                textAlign="center"
                sx={{ fontSize: { xs: "0.95rem", sm: "1rem" } }}
              >
                Got it! Your opinion helps us shape a better experience.
              </Typography>
            )}
          </>
        ) : (
          <Fade in>
            <Box mt={2}>
              <Typography
                variant="body1"
                color="success.main"
                fontWeight={600}
                sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}
              >
                🎉 Thank you for sharing your thoughts!
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                mt={1}
                sx={{ fontSize: { xs: "0.95rem", sm: "1rem" } }}
              >
                Your feedback is shaping the future of our store.
              </Typography>
            </Box>
          </Fade>
        )}
      </CardContent>
    </Card>
  );
}

import {
  Box,
  Button,
  Checkbox,
  Collapse,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useFetchProductsQuery, useFetchCategoriesQuery } from "./catalogApi";
import ProductList from "./ProductList";
import CatalogLoadingSkeleton from "./CatalogLoadingSkeleton";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

type Category = {
  category_id: number;
  category_name: string;
};

export default function Catalog() {
  const { data: products = [], isLoading } = useFetchProductsQuery();
  const { data: categories = [] } = useFetchCategoriesQuery();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("alphabetical");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const theme = useTheme();
  const isLaptop = useMediaQuery(theme.breakpoints.up("lg"));

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredProducts = products
    .filter((p) => p.product_name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) =>
      selectedCategories.length === 0
        ? true
        : selectedCategories.includes(p.category_name)
    )
    .sort((a, b) => {
      if (sortBy === "alphabetical")
        return a.product_name.localeCompare(b.product_name);
      if (sortBy === "priceLow")
        return a.MRP * (1 - a.discount / 100) - b.MRP * (1 - b.discount / 100);
      if (sortBy === "priceHigh")
        return b.MRP * (1 - b.discount / 100) - a.MRP * (1 - b.discount / 100);
      return 0;
    });

  if (isLoading) return <CatalogLoadingSkeleton />;

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, mt: -4 }}>
      {!isLaptop && (
        <Box
          display="flex"
          gap={2}
          alignItems="center"
          mb={2}
          flexDirection={{ xs: "column", sm: "row" }}
        >
          <TextField
            fullWidth
            label="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters((prev) => !prev)}
            sx={{
              borderRadius: 2,
              fontWeight: "bold",
              color: "secondary.main",
              borderColor: "secondary.main",
              whiteSpace: "nowrap",
              px: { xs: 2, sm: 3 }, // <== horizontal padding
              py: { xs: 1, sm: 1.2 }, // <== vertical padding
              fontSize: { xs: "0.75rem", sm: "0.9rem" },
              width: { xs: "100%", sm: "auto" },
              "&:hover": {
                backgroundColor: "rgba(245, 245, 245, 0.05)",
              },
            }}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </Box>
      )}

      {!isLaptop && (
        <Collapse in={showFilters} timeout="auto" unmountOnExit>
          <FilterSection
            sortBy={sortBy}
            setSortBy={setSortBy}
            categories={categories}
            selectedCategories={selectedCategories}
            handleCategoryChange={handleCategoryChange}
            resetFilters={() => setSelectedCategories([])}
            close={() => setShowFilters(false)}
          />
        </Collapse>
      )}

      {isLaptop ? (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={3}>
            <TextField
              fullWidth
              label="Search products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                mb: 2,
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
            <FilterSection
              sortBy={sortBy}
              setSortBy={setSortBy}
              categories={categories}
              selectedCategories={selectedCategories}
              handleCategoryChange={handleCategoryChange}
              resetFilters={() => setSelectedCategories([])}
            />
          </Grid>

          <Grid item xs={12} lg={9}>
            <ProductList products={filteredProducts} />
          </Grid>
        </Grid>
      ) : (
        <Box mt={3}>
          <ProductList products={filteredProducts} />
        </Box>
      )}
    </Box>
  );
}

function FilterSection({
  sortBy,
  setSortBy,
  categories,
  selectedCategories,
  handleCategoryChange,
  resetFilters,
  close,
}: {
  sortBy: string;
  setSortBy: (val: string) => void;
  categories: Category[];
  selectedCategories: string[];
  handleCategoryChange: (cat: string) => void;
  resetFilters: () => void;
  close?: () => void;
}) {
  return (
    <Box
      sx={{
        border: "2px solid rgb(161, 159, 161)",
        borderRadius: 2,
        p: 2,
        mb: 3,
        backgroundColor: "rgba(255,255,255,0.05)",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          flexDirection: { xs: "row", sm: "row" },
          gap: { xs: 1, sm: 2 },
          mb: 1,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          color="secondary"
          sx={{ mr: 2 }}
        >
          Filters
        </Typography>

        {close && (
          <IconButton
            onClick={close}
            sx={{
              ml: "auto", // push it to far right on small screens
              p: 0.5,
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ color: "secondary.main", mb: 1 }}
        >
          Sort by
        </Typography>
        <RadioGroup value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          {["alphabetical", "priceHigh", "priceLow"].map((value) => (
            <FormControlLabel
              key={value}
              value={value}
              control={
                <Radio sx={{ "&.Mui-checked": { color: "secondary.main" } }} />
              }
              label={
                value === "alphabetical"
                  ? "Alphabetical"
                  : value === "priceHigh"
                  ? "Price: High to Low"
                  : "Price: Low to High"
              }
            />
          ))}
        </RadioGroup>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ color: "secondary.main", mb: 1 }}
        >
          Categories
        </Typography>
        <FormGroup>
          {categories.map((cat) => (
            <FormControlLabel
              key={cat.category_id}
              control={
                <Checkbox
                  checked={selectedCategories.includes(cat.category_name)}
                  onChange={() => handleCategoryChange(cat.category_name)}
                  sx={{ "&.Mui-checked": { color: "secondary.main" } }}
                />
              }
              label={cat.category_name
                .split(" ")
                .map(
                  (word: string) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ")}
            />
          ))}
        </FormGroup>
      </Box>

      <Button
        variant="contained"
        onClick={resetFilters}
        fullWidth
        sx={{
          mt: 3,
          borderRadius: 1.2,
          fontSize: "1rem",
          backgroundColor: "secondary.main",
          color: "white",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "secondary.dark",
          },
        }}
      >
        Reset Filters
      </Button>
    </Box>
  );
}

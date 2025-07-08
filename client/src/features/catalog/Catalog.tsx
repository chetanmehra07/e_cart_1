import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useFetchProductsQuery, useFetchCategoriesQuery } from "./catalogApi";
import ProductList from "./ProductList";

export default function Catalog() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("alphabetical");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data: categories = [] } = useFetchCategoriesQuery();
  const {
    data: products = [],
    isLoading,
    isFetching,
  } = useFetchProductsQuery({ page: currentPage, limit: itemsPerPage });

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
        return b.MRP * (1 - b.discount / 100) - a.MRP * (1 - a.discount / 100);
      return 0;
    });

  // Reset page if filters/search/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy, selectedCategories]);

  if (isLoading || isFetching) return <div>Loading...</div>;

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {/* Sidebar */}
      <Box sx={{ minWidth: "260px" }}>
        <TextField
          fullWidth
          label="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            mb: 5,
            "& label.Mui-focused": {
              color: "secondary.main",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderWidth: "2px" },
              "&.Mui-focused fieldset": {
                borderColor: "secondary.main",
                borderWidth: "2px",
              },
            },
          }}
        />

        {/* Sort Options */}
        <Box
          sx={{ border: "2px solid #a19fa1", borderRadius: 1.2, p: 2, mb: 3 }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "secondary.main", mb: 1 }}
          >
            Sort by
          </Typography>

          <RadioGroup
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {["alphabetical", "priceHigh", "priceLow"].map((val) => (
              <FormControlLabel
                key={val}
                value={val}
                control={
                  <Radio
                    sx={{ "&.Mui-checked": { color: "secondary.main" } }}
                  />
                }
                label={
                  val === "alphabetical"
                    ? "Alphabetical"
                    : val === "priceHigh"
                    ? "Price: High to Low"
                    : "Price: Low to High"
                }
              />
            ))}
          </RadioGroup>
        </Box>

        {/* Category Filters */}
        <Box sx={{ border: "2px solid #a19fa1", borderRadius: 1.2, p: 2 }}>
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
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}
              />
            ))}
          </FormGroup>
        </Box>

        {/* Reset Filters */}
        <Button
          variant="contained"
          onClick={() => setSelectedCategories([])}
          sx={{
            mt: 4,
            ml: 2,
            px: 6,
            py: 1,
            borderRadius: 1.2,
            fontSize: "1rem",
            backgroundColor: "secondary.main",
            color: "white",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "secondary.main",
            },
          }}
        >
          Reset Filters
        </Button>
      </Box>

      {/* Product Grid */}
      <Box flex={1}>
        <ProductList products={filteredProducts} />

        {/* Pagination */}
        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          <Button
            variant="outlined"
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </Button>

          <Typography variant="body1" fontWeight="bold">
            Page {currentPage}
          </Typography>

          <Button
            variant="outlined"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={products.length < itemsPerPage}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

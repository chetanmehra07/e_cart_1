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
import { useState } from "react";
import { useFetchProductsQuery, useFetchCategoriesQuery } from "./catalogApi";
import ProductList from "./ProductList";

export default function Catalog() {
  const { data: products = [], isLoading } = useFetchProductsQuery();
  const { data: categories = [] } = useFetchCategoriesQuery();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("alphabetical");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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

  if (isLoading) return <div>Loading...</div>;

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {/* Sidebar Filters */}
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

        <Box
          sx={{
            border: "2px solid rgb(161, 159, 161)", // light purple border
            borderRadius: 1.2,
            p: 2,
            mb: 3,
          }}
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
            <FormControlLabel
              value="alphabetical"
              control={
                <Radio
                  sx={{
                    "&.Mui-checked": {
                      color: "secondary.main",
                    },
                  }}
                />
              }
              label="Alphabetical"
            />
            <FormControlLabel
              value="priceHigh"
              control={
                <Radio
                  sx={{
                    "&.Mui-checked": {
                      color: "secondary.main",
                    },
                  }}
                />
              }
              label="Price: High to Low"
            />
            <FormControlLabel
              value="priceLow"
              control={
                <Radio
                  sx={{
                    "&.Mui-checked": {
                      color: "secondary.main",
                    },
                  }}
                />
              }
              label="Price: Low to High"
            />
          </RadioGroup>
        </Box>

        <Box
          sx={{
            border: "2px solid rgb(161, 159, 161)", // light purple border
            borderRadius: 1.2,
            p: 2,
            mt: 2,
          }}
        >
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
                    sx={{
                      "&.Mui-checked": {
                        color: "secondary.main",
                      },
                    }}
                  />
                }
                label={cat.category_name
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              />
            ))}
          </FormGroup>
        </Box>

        <Button
          variant="contained"
          onClick={() => setSelectedCategories([])}
          sx={{
            mt: 4,
            ml: 2,
            paddingLeft: 6,
            paddingRight: 6,
            paddingBottom: 1,
            paddingTop: 1,
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
      </Box>
    </Box>
  );
}

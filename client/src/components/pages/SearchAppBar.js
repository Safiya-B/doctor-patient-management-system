import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  styled,
  alpha,
  InputBase,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Delete } from "@mui/icons-material";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  color: theme.palette.text.secondary,
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.secondary,
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "16ch",
      "&:focus": {
        width: "24ch",
      },
    },
  },
}));

const SearchAppBar = ({
  placeholder = "Search…",
  onSearch,
  showDeleteSection = false,
  selectedRows = [],
  onClick,
}) => {
  const handleSearch = (event) => {
    onSearch && onSearch(event.target.value);
  };

  return (
    <Box>
      <AppBar
        position="static"
        elevation={2}
        sx={{
          borderRadius: "4px 4px 0 0",
          padding: "4px",
          backgroundColor: "#ffffff",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder={placeholder}
              onChange={handleSearch}
            />
          </Search>
          {showDeleteSection && selectedRows.length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1" color="text.primary" sx={{ mr: 2 }}>
                {selectedRows.length} record(s) selected for deletion
              </Typography>
              <IconButton
                sx={{
                  color: "error.main",
                }}
                onClick={onClick}
                aria-label="delete"
              >
                <Delete />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default SearchAppBar;

import { createTheme } from "@mui/material/styles";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import palette from "./colors";
import typography from "./typography";
import { grey } from "@mui/material/colors";

const theme = createTheme({
  palette,
  typography,
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1c2025",
          color: "#ffffff",
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: grey[100],
        },
      },
    },

    /*  MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: palette.primary.main,
          },
          "&.Mui-selected:hover": {
            backgroundColor: palette.primary.dark,
          },
          "&:hover": {
            backgroundColor: "#2d333b",
          },
        },
      },
    }, */

    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "#424242",
        },
      },
    },
  },
});

export default theme;

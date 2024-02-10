import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import { AuthContextProvider } from "./hooks/authContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RoomContextProvider } from "./hooks/roomContext.jsx";

const queryClient = new QueryClient();

const theme = createTheme({
  typography: {
    fontFamily: ["Oxygen", "cursive"].join(","),
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1400,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <ThemeProvider theme={theme}>
          <RoomContextProvider>
            <App />
          </RoomContextProvider>
        </ThemeProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

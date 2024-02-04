import { useState } from "react";

import {
  Box,
  Container,
  createTheme,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import Login from "./Login";
import SignUp from "./SignUp";

function AuthScreen() {
  const [authPage, setAuthPage] = useState("login");
  const theme = createTheme({
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

  return (
    <>
      <ThemeProvider theme={theme}>
        <Box
          component={"div"}
          sx={{
            margin: {
              lg: "2% 0 0 0",
            },

            display: {
              md: "flex",
            },
            justifyContent: {
              md: "center",
            },
          }}
        >
          <Box
            component={"div"}
            sx={{
              border: {
                md: "1px solid black",
              },
              borderRadius: "25px",
              minWidth: {
                xs: "100%",
                md: "50%",
              },
            }}
          >
            <Container
              fixed
              sx={{
                display: "flex",
                justifyContent: "center",

                marginTop: {
                  xs: "8px",
                  md: "1rem",
                },
              }}
            >
              <ToggleButtonGroup
                color="primary"
                value={authPage}
                exclusive
                onChange={(e) => {
                  const page = e.target.value;
                  setAuthPage(page);
                }}
              >
                <ToggleButton
                  value="login"
                  sx={{
                    padding: {
                      xs: "4px 16px",
                      sm: "8px 48px",
                    },

                    borderRadius: "30px",
                    fontWeight: "bold",
                  }}
                >
                  Login
                </ToggleButton>
                <ToggleButton
                  value="signup"
                  sx={{
                    padding: {
                      xs: "4px 16px",
                      sm: "8px 48px",
                    },
                    borderRadius: "30px",
                    fontWeight: "bold",
                  }}
                >
                  Sign Up
                </ToggleButton>
              </ToggleButtonGroup>
            </Container>

            <Box
              component={"div"}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: {
                    xs: "100%",
                    md: "77.7%",
                  },
                }}
              >
                {authPage === "login" && <Login setAuthPage={setAuthPage} />}
                {authPage === "signup" && <SignUp setAuthPage={setAuthPage} />}
              </Box>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}

export default AuthScreen;

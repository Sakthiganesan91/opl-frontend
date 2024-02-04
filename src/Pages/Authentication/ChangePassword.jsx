import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import { useNavigate, useLocation } from "react-router-dom";
function ChangePassword() {
  const navigate = useNavigate();
  const loc = useLocation();
  const email = loc.state;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isPasswordError, setIsPasswordError] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setIsPasswordError(true);
      return;
    }

    axios
      .post("http://localhost:8081/user/change-password", {
        email,
        password,
      })
      .then((res) => {
        if (res.data.success) {
          navigate("/auth");
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  return (
    <Box
      sx={{
        backgroundColor: "#02eff5",
        height: "100vh",
        overflowY: "scroll",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          paddingTop: {
            xs: "1rem",
            md: "1.5rem",
          },
        }}
      >
        <Typography variant="h4">EXIT</Typography>
      </Box>
      <Box
        sx={{
          display: {
            md: "flex",
          },
        }}
      >
        <Box
          sx={{
            border: "2px solid white",
            borderRadius: "20px",
            padding: "8px 4px",
            height: "fit-content",
            margin: {
              xs: "3rem 0.5rem",
              sm: "4rem 2rem",
              md: "4.5rem 20%",
              lg: "5rem 35%",
            },
            backgroundColor: "#c0eced",
            width: {
              md: "75%",
              lg: "60%",
            },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
            }}
          >
            Change Password
          </Typography>
          <Box
            component="form"
            sx={{
              width: "100%",
            }}
            onSubmit={submitHandler}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                margin: {
                  md: "0 2rem ",
                },
              }}
            >
              <TextField
                required
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="standard"
                sx={{
                  width: {
                    xs: "90%",
                    sm: "85%",
                    md: "75%",
                    lg: "75%",
                  },
                  margin: {
                    xs: "10px",
                    sm: "8px",
                  },
                }}
              />
              {showPassword ? (
                <FontAwesomeIcon
                  icon={faEyeSlash}
                  onClick={handleShowPassword}
                />
              ) : (
                <FontAwesomeIcon icon={faEye} onClick={handleShowPassword} />
              )}
            </Box>
            <Box
              sx={{
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  margin: {
                    md: "0 2rem ",
                  },
                }}
              >
                <TextField
                  required
                  error={isPasswordError}
                  helperText={isPasswordError ? "Password don't match" : ""}
                  id="password"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  variant="standard"
                  sx={{
                    width: {
                      xs: "90%",
                      sm: "85%",
                      md: "75%",
                      lg: "75%",
                    },
                    margin: {
                      xs: "10px",
                      sm: "8px",
                    },
                  }}
                />
                {showConfirmPassword ? (
                  <FontAwesomeIcon
                    icon={faEyeSlash}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faEye}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                )}
              </Box>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#029cf5",
                  borderRadius: "5px",

                  margin: "1rem 2.5rem ",
                }}
              >
                Change password
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ChangePassword;

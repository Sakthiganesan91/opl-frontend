import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");

  const navigate = useNavigate();

  const [showMessage, setShowMessage] = useState(false);

  const [otpSent, setOTPSent] = useState(false);
  const [showOTPMessage, setShowOTPMessage] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isEmailError, setIsEmailError] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShowMessage(false);
      setShowOTPMessage(false);
    }, 1000);
  }, [showMessage, showOTPMessage]);

  const submitHandler = (event) => {
    event.preventDefault();

    const regex =
      // eslint-disable-next-line no-useless-escape
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (regex.test(email) === false) {
      setEmailError("Invalid Email");
      setIsEmailError(true);
      return;
    }

    axios
      .post("http://localhost:8081/user/forgot-password", {
        email,
      })
      .then((res) => {
        console.log(res.data);
        setSuccess(res.data.success);
        setMessage(res.data.message);
        setShowMessage(true);
        setOTPSent(true);
      })
      .catch((err) => {
        setSuccess(err.response.data.success);
        setMessage(err.response.data.message);
        setShowMessage(true);
        console.log("error", err.response.data);
      });
  };

  const OTPSubmitHandler = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8081/user/otp-verify", {
        otp: parseInt(otp),
        email: email,
      })
      .then((res) => {
        if (res.data.success) {
          navigate("/change-password", {
            state: email,
          });
        }
      })
      .catch((err) => {
        setSuccess(err.response.data.success);
        setMessage(err.response.data.message);
        setShowOTPMessage(true);
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
              lg: "5rem 25%",
            },
            backgroundColor: "#c0eced",
            width: {
              md: "75%",
              lg: "50%",
            },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
            }}
          >
            Forgot Password
          </Typography>
          <Box
            onSubmit={submitHandler}
            component="form"
            sx={{
              margin: "32px 8px",
            }}
          >
            <TextField
              required
              error={isEmailError}
              helperText={isEmailError ? emailError : ""}
              id="email"
              autoComplete="off"
              label="Email"
              variant="standard"
              sx={{
                width: {
                  xs: "100%",
                  sm: "80%",
                  md: "55%",
                },
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Box
              sx={{
                margin: "8px",
                display: {
                  xs: "flex",
                  md: "block",
                },
                justifyContent: "center",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#029cf5",
                  borderRadius: "5px",
                }}
              >
                {otpSent ? "Resend OTP" : "Send OTP"}
              </Button>
            </Box>
          </Box>
          {showMessage && (
            <Alert
              severity={success ? "success" : "error"}
              sx={{
                width: {
                  md: "50%",
                },
              }}
            >
              {message}
            </Alert>
          )}

          <Box
            action=""
            onSubmit={OTPSubmitHandler}
            component="form"
            sx={{
              margin: "16px 8px",
            }}
          >
            <TextField
              type="number"
              label="OTP"
              name="otp"
              id="otp"
              value={otp}
              onChange={(e) => {
                setOTP(e.target.value);
              }}
              sx={{
                width: {
                  xs: "100%",
                  sm: "80%",
                  md: "50%",
                },
              }}
              variant="standard"
            />

            <Box
              sx={{
                margin: "8px",
                display: {
                  xs: "flex",
                  md: "block",
                },
                justifyContent: "center",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#029cf5",
                  borderRadius: "5px",
                }}
              >
                Verify
              </Button>
            </Box>
            {showOTPMessage && (
              <Alert
                severity={success ? "success" : "error"}
                sx={{
                  width: {
                    md: "50%",
                  },
                }}
              >
                {message}
              </Alert>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ForgotPassword;

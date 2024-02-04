/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
import { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Box, Button, TextField } from "@mui/material";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { authContext } from "../../hooks/authContext";
import { request } from "../../global/axiosGlobal";

function Login(props) {
  const navigate = useNavigate();
  const { dispatch } = useContext(authContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const regex =
      // eslint-disable-next-line no-useless-escape
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (regex.test(email) === false) {
      setEmailError("Invalid Email");
      setIsEmailError(true);
      return;
    }
    request
      .post("/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        setEmail("");
        setPassword("");
        setEmailError("");
        setPasswordError("");
        dispatch({ type: "LOGIN", payload: response.data });

        localStorage.setItem(
          "user",
          JSON.stringify({ id: response.data.id, token: response.data.token })
        );
        navigate("/");
      })
      .catch((err) => {
        const e = err.response.data.error;
        console.log(e);
        if (e.split(" ").includes("User")) {
          setEmailError(e);
          setIsEmailError(true);
          return;
        }
        setIsEmailError(false);
        if (e.split(" ").includes("Password")) {
          setPasswordError(e);
          setIsPasswordError(true);
          return;
        }
        setIsPasswordError(false);
      });
  };
  return (
    <div className="m-4">
      <form onSubmit={onSubmitHandler}>
        <TextField
          required
          autoComplete="off"
          error={isEmailError}
          helperText={isEmailError ? emailError : ""}
          id="email"
          label="Email"
          variant="standard"
          sx={{
            width: "100%",
          }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <TextField
            required
            error={isPasswordError}
            helperText={isPasswordError ? passwordError : null}
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="standard"
            sx={{
              width: "95%",
              margin: {
                xs: "16px 0",
                sm: "8px 0",
              },
            }}
          />

          {showPassword ? (
            <FontAwesomeIcon icon={faEyeSlash} onClick={handleShowPassword} />
          ) : (
            <FontAwesomeIcon icon={faEye} onClick={handleShowPassword} />
          )}
        </Box>

        <div className="text-right mt-2">
          <Link to={"/forgot-password"}>Forgot Password</Link>
        </div>

        <div>
          <Button
            variant="contained"
            size="small"
            type="submit"
            sx={{
              padding: "8px 32px",
              margin: "8px 0",
              backgroundColor: "rgb(11,181,255)",
            }}
          >
            Login
          </Button>
        </div>
      </form>
      <p
        style={{
          cursor: "pointer",
        }}
        onClick={() => {
          props.setAuthPage("signup");
        }}
      >
        Dont Have An Account , SignUp
      </p>
    </div>
  );
}

export default Login;

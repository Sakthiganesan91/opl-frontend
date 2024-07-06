import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "@tanstack/react-query";
import { Box, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { request } from "../../global/axiosGlobal";
function SignUp(props) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);

  const [user, setUser] = useState({
    email: "",

    firstName: "",
    lastName: "",
    phoneNumber: "",
    password: "",
    userType: "",
  });

  const emailHandler = (e) => {
    setUser({
      ...user,
      email: e.target.value,
    });
  };

  const passwordHandler = (e) => {
    setUser({
      ...user,
      password: e.target.value,
    });
  };
  const firstnameHandler = (e) => {
    setUser({
      ...user,
      firstName: e.target.value,
    });
  };
  const lastNameHandler = (e) => {
    setUser({
      ...user,
      lastName: e.target.value,
    });
  };

  const phoneNumberHandler = (e) => {
    setUser({
      ...user,
      phoneNumber: e.target.value,
    });
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (regex.test(user.email) === false) {
      setEmailError("Invalid Email");
      setIsEmailError(true);
      return;
    }
    if (user.password.length < 6) {
      setPasswordError("Password length must be 6");
      setIsPasswordError(true);
      return;
    }

    setIsPasswordError(false);

    setIsEmailError(false);
    console.log(user);
  };

  return (
    <div className="mx-3 my-1">
      <form onSubmit={submitHandler}>
        <TextField
          autoComplete="off"
          required
          id="email"
          label="Email"
          error={isEmailError}
          helperText={isEmailError ? emailError : ""}
          variant="standard"
          sx={{
            width: "100%",
          }}
          value={user.email}
          onChange={emailHandler}
        />
        <TextField
          required
          id="username"
          label="Username"
          variant="standard"
          sx={{
            width: "100%",
            marginBottom: "8px",
          }}
          value={user.username}
          onChange={usernameHandler}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            marginTop: 0,
          }}
        >
          <TextField
            required
            id="password"
            label="Password"
            error={isPasswordError}
            helperText={isPasswordError ? passwordError : null}
            type={showPassword ? "text" : "password"}
            value={user.password}
            onChange={passwordHandler}
            variant="standard"
            sx={{
              width: "95%",
            }}
          />

          {showPassword ? (
            <FontAwesomeIcon icon={faEyeSlash} onClick={handleShowPassword} />
          ) : (
            <FontAwesomeIcon icon={faEye} onClick={handleShowPassword} />
          )}
        </Box>
        <TextField
          type="text"
          variant="standard"
          required
          id="fname"
          label="First Name"
          sx={{
            width: "100%",
          }}
          value={user.firstName}
          onChange={firstnameHandler}
        />
        <TextField
          type="text"
          variant="standard"
          required
          id="lname"
          label="Last Name"
          sx={{
            width: "100%",
          }}
          value={user.lastName}
          onChange={lastNameHandler}
        />

        <TextField
          type="tel"
          variant="standard"
          required
          id="phone"
          label="Phone Number"
          sx={{
            width: "100%",
          }}
          value={user.phoneNumber}
          onChange={phoneNumberHandler}
        />
        <TextField
          type="text"
          variant="standard"
          id="bio"
          required
          label="Bio"
          sx={{
            width: "100%",
          }}
          value={user.bio}
          onChange={bioHandler}
        />

        <TextField
          type="text"
          variant="standard"
          id="linkedin"
          label="Linkedin"
          sx={{
            width: "100%",
          }}
          error={linkedinError}
          helperText={linkedinError ? linkedinErrorMessage : ""}
          value={user.linkedin}
          onChange={linkedinHandler}
        />

        <TextField
          type="text"
          variant="standard"
          id="github"
          label="Github"
          sx={{
            width: "100%",
          }}
          error={githubError}
          helperText={githubError ? githubErrorMessage : ""}
          value={user.github}
          onChange={githubHandler}
        />

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
            Next
          </Button>
        </div>
      </form>
      <p
        style={{
          cursor: "pointer",
        }}
        onClick={() => {
          // eslint-disable-next-line react/prop-types
          props.setAuthPage("login");
        }}
      >
        Already Have An Account , Login
      </p>
    </div>
  );
}

export default SignUp;

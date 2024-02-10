import { createContext, useReducer, useEffect } from "react";

import { request } from "../global/axiosGlobal";

export const authContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    default:
      return state;
    case "LOGIN":
      return {
        user: action.payload,
      };

    case "LOGOUT":
      return {
        user: null,
      };
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      request
        .post("/verify-token", {
          token: user.token,
        })
        .then((res) => {
          if (res.data.tokenValid) {
            dispatch({ type: "LOGIN", payload: user });
          }
        })
        .catch((err) => {
          dispatch({ type: "LOGOUT" });
        });
    }
  }, []);

  return (
    <authContext.Provider value={{ ...state, dispatch }}>
      {children}
    </authContext.Provider>
  );
};

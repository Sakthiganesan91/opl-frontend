import { createContext, useEffect, useReducer } from "react";

const initalState = {
  selectedRoom: null,
};
export const roomContext = createContext(initalState);

export const roomReducer = (state, action) => {
  switch (action.type) {
    default:
      return state;
    case "ROOM":
      return {
        selectedRoom: action.payload,
      };
  }
};

export const RoomContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(roomReducer, initalState);

  return (
    <roomContext.Provider value={{ state, dispatch }}>
      {children}
    </roomContext.Provider>
  );
};

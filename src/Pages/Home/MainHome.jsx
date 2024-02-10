import React from "react";
import Navbar from "../../Components/Navbar";
import { RoomContextProvider } from "../../hooks/roomContext";

import ChatSection from "./ChatSection";

function MainHome() {
  return (
    <>
      <ChatSection />
    </>
  );
}

export default MainHome;

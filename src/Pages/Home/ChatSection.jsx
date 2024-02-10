import { Box, Button, ButtonGroup } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import ChatRoom from "../../Components/ChatRoom";
import { request } from "../../global/axiosGlobal";
import { authContext } from "../../hooks/authContext";
import AddRoom from "./AddRoom";
import { roomContext } from "../../hooks/roomContext";

function ChatSection() {
  const { user } = useContext(authContext);

  const { state, dispatch } = useContext(roomContext);

  const [initalPageNumber, setInitialPageNumber] = useState(1);
  const { data } = useQuery({
    queryKey: ["user", user.id],
    queryFn: () => {
      return request.get(`/get-user/${user.id}`, {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      });
    },
  });

  return (
    <>
      <Box component={"div"}>
        <div>
          <Box component={"div"}>
            <h2
              style={{
                marginRight: "8px",
              }}
            >
              Rooms
            </h2>
            <Link to={"/saved-post"}>
              <h3>Show Saved Queries</h3>
            </Link>
          </Box>
          {/* <AddRoom /> */}

          <ButtonGroup
            variant="outlined"
            aria-label="text button group"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              margin: {
                xs: "16px 0",
                sm: "0 0 32px 0",
              },
            }}
          >
            {data?.data.user.rooms.map((room) => {
              return (
                <div key={room.id}>
                  <Button
                    onClick={() => {
                      dispatch({ type: "ROOM", payload: room.id });
                      setInitialPageNumber(1);
                    }}
                  >
                    {room.name}
                  </Button>
                </div>
              );
            })}
          </ButtonGroup>
        </div>

        {state.selectedRoom ? (
          <Box
            sx={{
              margin: {
                sm: "0 25%",
              },
            }}
          >
            <ChatRoom
              room={state.selectedRoom}
              initalPageNumber={initalPageNumber}
            />
          </Box>
        ) : (
          <h1
            style={{
              textAlign: "center",
            }}
          >
            Select Rooms To Explore
          </h1>
        )}
      </Box>
    </>
  );
}

export default ChatSection;

import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";

import ChatRoom from "../../Components/ChatRoom";
import { request } from "../../global/axiosGlobal";
import { authContext } from "../../hooks/authContext";
import AddRoom from "./AddRoom";

function ChatSection() {
  const { user } = useContext(authContext);

  const [selectedRoom, setSelectedRoom] = useState(null);

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
      <div
        style={{
          marginTop: "5%",
        }}
      >
        <div>
          <h2>Rooms</h2>
          <Link to={"/saved-post"}>Saved Queries</Link>
          <AddRoom />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {data?.data.user.rooms.map((room) => {
              return (
                <div
                  key={room.id}
                  style={{
                    margin: "16px 0",
                    border: "1px solid black",
                    width: "fit-content",
                    padding: "8px",
                  }}
                >
                  <button
                    onClick={() => {
                      setSelectedRoom(room.id);
                    }}
                  >
                    {room.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {selectedRoom ? (
          <div style={{ border: "1px solid black", padding: "12px" }}>
            <ChatRoom room={selectedRoom} setSelectedRoom={setSelectedRoom} />
          </div>
        ) : (
          <h1
            style={{
              textAlign: "center",
            }}
          >
            Select Rooms To Explore
          </h1>
        )}
      </div>
    </>
  );
}

export default ChatSection;

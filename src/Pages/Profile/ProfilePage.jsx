import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { request } from "../../global/axiosGlobal";
import { authContext } from "../../hooks/authContext";

function ProfilePage() {
  const location = useLocation();

  const userId = location.state;

  const navigate = useNavigate();

  const { user, dispatch } = useContext(authContext);
  const { data } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => {
      return request.get(`/get-user/${userId}`, {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      });
    },
  });

  const logoutHandler = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <div>
      <h1>{data?.data.user.username}</h1>
      <p>
        <b>{data?.data.user.bio}</b>
      </p>

      {data?.data.user.github && <h2>{data.data.user.github}</h2>}
      {data?.data.user.linkedin && <h2>{data.data.user.linkedin}</h2>}

      <h3>Rooms</h3>

      <div>
        {data?.data.user.rooms.map((room) => {
          return <p key={room.id}>{room.name}</p>;
        })}
      </div>
      <div>
        <div>
          <button onClick={logoutHandler}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

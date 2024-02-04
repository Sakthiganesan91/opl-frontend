import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../global/axiosGlobal";
import { authContext } from "../hooks/authContext";
import QueryForm from "./QueryForm";

function ChatRoom({ room, setSelectedRoom }) {
  const { user } = useContext(authContext);
  const [pageNumber, setPageNumber] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["queries", room.toLowerCase(), pageNumber],
    queryFn: () => {
      return request.get(
        `/chat/${room.toLowerCase()}/?page=${pageNumber}&limit=5`,
        {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        }
      );
    },
  });

  const queryClient = useQueryClient();

  const deletion = useMutation({
    mutationFn: (id) => {
      return request.delete(`/chat/${room.toLowerCase()}/${id}`, {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["queries", room.toLowerCase(), pageNumber],
      });
    },
  });

  const leaveRoomMutation = useMutation({
    mutationFn: () => {
      return request.delete(`/leave-room/${user.id}/${room.toLowerCase()}`, {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      });
    },
    onSuccess: (data) => {
      console.log(data.data.message);
      queryClient.invalidateQueries({ queryKey: ["user", user.id] });
      setSelectedRoom(null);
    },
  });

  const deleteHandler = (id) => {
    deletion.mutate(id);
  };

  return (
    <div
      style={{
        margin: "16px 0",
      }}
    >
      <h1>{room.toUpperCase()}</h1>
      <button
        onClick={() => {
          leaveRoomMutation.mutate();
        }}
      >
        Leave Room
      </button>

      {isOpen ? (
        <QueryForm room={room.toLowerCase()} setIsOpen={setIsOpen} />
      ) : (
        <button
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Add Query
        </button>
      )}
      {isLoading
        ? "Loading..."
        : data?.data.queries.map((query) => {
            return (
              <React.Fragment key={query._id}>
                <div
                  style={{
                    border: "1px solid black",
                    margin: "16px 0",
                    padding: "8px 128px 0 8px",
                  }}
                >
                  <p>{query.user.username}</p>

                  {/***Menu */}

                  <div>
                    <p>{query.title}</p>
                    <p>{query.description}</p>

                    <p
                      dangerouslySetInnerHTML={{ __html: query.detailsWanted }}
                    ></p>
                  </div>
                  {user.id === query.user._id && (
                    <button
                      type="button"
                      onClick={() => deleteHandler(query._id)}
                    >
                      Delete
                    </button>
                  )}
                  <Link to={"/profile"} state={query.user._id}>
                    Show Profile
                  </Link>

                  <Link to={`/query/${room.toLowerCase()}/${query._id}`}>
                    Open
                  </Link>
                </div>
              </React.Fragment>
            );
          })}

      {data?.data.queries.length !== 0 && (
        <button
          disabled={pageNumber === 1}
          onClick={() => {
            setPageNumber((prev) => prev - 1);
          }}
        >
          Previous
        </button>
      )}

      {new Array(data?.data.totalPages).fill(0).map((_, index) => (
        <button
          style={{
            backgroundColor: pageNumber === index + 1 ? "red" : "green",
          }}
          key={index}
          onClick={() => {
            setPageNumber(index + 1);
          }}
        >
          {index + 1}
        </button>
      ))}

      {data?.data.queries.length !== 0 && (
        <button
          disabled={data?.data.totalPages === pageNumber}
          onClick={() => {
            setPageNumber((prev) => prev + 1);
          }}
        >
          Next
        </button>
      )}
    </div>
  );
}

export default ChatRoom;
/***
 *
 *
 */

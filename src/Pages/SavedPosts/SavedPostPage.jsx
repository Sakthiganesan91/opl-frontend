import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../../global/axiosGlobal";
import { authContext } from "../../hooks/authContext";

function SavedPostPage() {
  const { user } = useContext(authContext);
  const [pageNumber, setPageNumber] = useState(1);
  const { data, isError, isLoading } = useQuery({
    queryKey: ["savedPost", pageNumber],
    queryFn: () => {
      return request.get(
        `/get-save-post/${user.id}/?page=${pageNumber}&limit=5`,
        {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        }
      );
    },
  });

  if (isError) {
    <p>Error</p>;
    return;
  }

  const queryClient = useQueryClient();

  const deletion = useMutation({
    mutationFn: ({ id, room }) => {
      return request.delete(`/chat/${room.toLowerCase()}/${id}`, {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      });
    },
    onSuccess: (data) => {
      console.log(data.data.message);
      queryClient.invalidateQueries({
        queryKey: ["savedPost"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const deleteHandler = (id, room) => {
    console.log(id, room);
    deletion.mutate({ id, room });
  };

  return (
    <div>
      <h1>Saved Posts</h1>
      {isLoading
        ? "Loading..."
        : data?.data?.savedPosts.map((query) => {
            return (
              <React.Fragment key={query._id}>
                <div
                  style={{
                    border: "1px solid black",
                    margin: "16px 0",
                    padding: "8px 128px 0 8px",
                  }}
                >
                  <p>{query?.user?.username}</p>

                  <div>
                    <p>
                      Room <b>{query.roomId.toUpperCase()}</b>{" "}
                    </p>
                    <p>{query.title}</p>
                    <p>{query.description}</p>
                  </div>
                  {user.id === query.user._id && (
                    <button
                      type="button"
                      onClick={() =>
                        deleteHandler(query._id, query.roomId.toLowerCase())
                      }
                    >
                      Delete
                    </button>
                  )}
                  <Link to={"/profile"} state={query.user._id}>
                    Show Profile
                  </Link>

                  <Link
                    to={`/query/${query.roomId.toLowerCase()}/${query._id}`}
                  >
                    Open
                  </Link>
                </div>
              </React.Fragment>
            );
          })}

      {data?.data.savedPosts.length !== 0 && (
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

      {data?.data.savedPosts.length !== 0 && (
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

export default SavedPostPage;

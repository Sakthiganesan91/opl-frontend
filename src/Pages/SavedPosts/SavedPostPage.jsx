import { Box, Button, LinearProgress } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../../global/axiosGlobal";
import { authContext } from "../../hooks/authContext";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
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
    deletion.mutate({ id, room });
  };

  const likeMutation = useMutation({
    mutationFn: (queryId) => {
      return request.put(
        `/like-query/${queryId}`,
        {},
        {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        }
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["savedPost", pageNumber],
      });
    },
    onError: (err) => {
      console.log(err.response);
    },
  });

  return (
    <Box
      typography={{
        fontFamily: ["Oxygen", "cursive"].join(","),
      }}
      sx={{
        margin: {
          sm: "0 25%",
        },
      }}
    >
      <h1
        style={{
          textAlign: "center",
        }}
      >
        Saved Posts
      </h1>
      <div>
        {isLoading ? (
          <div
            style={{
              margin: "8px 0",
            }}
          >
            <LinearProgress />
          </div>
        ) : (
          <div>
            {data?.data?.savedPosts.map((query) => {
              return (
                <React.Fragment key={query._id}>
                  <div
                    style={{
                      border: "2px solid black",
                      borderRadius: "15px",
                      margin: "16px 2px",
                      padding: "16px",
                      boxShadow: "4px 4px 2px grey",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <p>
                        <strong>{query.user.username}</strong>
                      </p>
                      <Link
                        to={"/profile"}
                        state={query.user._id}
                        style={{
                          marginLeft: "2px",
                        }}
                      >
                        <AccountCircleIcon />
                      </Link>
                    </div>

                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <h6>Posted on {query.createdAt.split("T")[0]}</h6>
                        {user.id === query.user._id && (
                          <IconButton
                            aria-label="delete"
                            onClick={() =>
                              deleteHandler(
                                query._id,
                                query.roomId.toLowerCase()
                              )
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </div>
                      <p>
                        <b>{query.roomId.toUpperCase()}</b>{" "}
                      </p>
                    </div>

                    <div
                      style={{
                        margin: "8px 0",
                      }}
                    >
                      <h5>Query Title</h5>
                      <p>{query.title}</p>
                    </div>
                    <div
                      style={{
                        margin: "8px 0",
                      }}
                    >
                      <h5>Query Description</h5>
                      <p
                        style={{
                          textAlign: "justify",
                        }}
                      >
                        {query.description}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <IconButton
                        onClick={() => {
                          likeMutation.mutate(query._id);
                        }}
                      >
                        {query.useful.userIds.find((userId) => {
                          return userId.toString() === user.id;
                        }) ? (
                          <ThumbUpAltIcon />
                        ) : (
                          <ThumbUpOffAltIcon />
                        )}
                      </IconButton>
                      <p>
                        {query.useful.usefulCount > 0 &&
                          query.useful.usefulCount}
                      </p>
                      <Link
                        to={`/query/${query.roomId.toLowerCase()}/${query._id}`}
                        style={{
                          marginLeft: "16px",
                        }}
                      >
                        <b>Open</b>
                      </Link>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}

            <div
              style={{
                margin: "16px 0",
                textAlign: "center",
              }}
            >
              {data?.data.savedPosts.length !== 0 && (
                <Button
                  disabled={pageNumber === 1}
                  onClick={() => {
                    setPageNumber((prev) => prev - 1);
                  }}
                >
                  Previous
                </Button>
              )}

              {new Array(data?.data.totalPages).fill(0).map((_, index) => (
                <Button
                  variant={pageNumber === index + 1 ? "contained" : "text"}
                  key={index}
                  onClick={() => {
                    setPageNumber(index + 1);
                  }}
                >
                  {index + 1}
                </Button>
              ))}

              {data?.data.savedPosts.length !== 0 && (
                <Button
                  disabled={data?.data.totalPages === pageNumber}
                  onClick={() => {
                    setPageNumber((prev) => prev + 1);
                  }}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Box>
  );
}

export default SavedPostPage;

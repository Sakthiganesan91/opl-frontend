import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useContext } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { request } from "../global/axiosGlobal";
import { authContext } from "../hooks/authContext";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import EditComment from "./EditComment";

function Comment({ roomId, queryId }) {
  const [selectedComment, setSelectedComment] = useState(null);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("<p><br></p>");
  const { user } = useContext(authContext);
  const { data } = useQuery({
    queryKey: ["comments", roomId, queryId],
    queryFn: () => {
      return request.get(`/comment/${roomId}/${queryId}`, {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      });
    },
  });

  const mutation = useMutation({
    mutationFn: (comment) => {
      return request.post(
        `/comment/${roomId}/${queryId}`,
        {
          comment,
        },
        {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        }
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", roomId, queryId],
      });
      setComment("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId) => {
      return request.delete(
        `/comment/${roomId}/${queryId}/${commentId}`,

        {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        }
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", roomId, queryId],
      });
    },
  });

  const likeMutation = useMutation({
    mutationFn: (commentId) => {
      return request.put(
        `/like-comment/${commentId}`,
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
        queryKey: ["comments", roomId, queryId],
      });
      setComment("");
    },
    onError: (err) => {
      console.log(err.response);
    },
  });

  const submitHandler = (event) => {
    event.preventDefault();

    if (comment === "<p><br></p>") return;

    mutation.mutate(comment);
  };
  return (
    <div>
      <p>Type Comment</p>
      <form onSubmit={submitHandler}>
        <ReactQuill
          theme="snow"
          value={comment}
          onChange={setComment}
          style={{
            display: "flex",
            flexDirection: "column",
            overflowX: "clip",
            overflowWrap: "break-word",
            wordWrap: "break-word",
            wordBreak: "break-word",
          }}
        />

        {comment !== "<p><br></p>" && (
          <button type="submit">Add Comment</button>
        )}
      </form>
      {data?.data.comments.map((comment) => {
        return (
          <div
            key={comment._id}
            style={{
              border: "1px solid black",
              margin: "8px 0",
              padding: "8px 8px",
            }}
          >
            {user.id === comment.user._id && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedComment(comment);
                    handleOpen();
                  }}
                >
                  Edit Comment
                </button>

                <button
                  type="button"
                  onClick={() => {
                    deleteMutation.mutate(comment._id);
                  }}
                >
                  Delete Comment
                </button>
              </>
            )}

            {
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  {selectedComment && (
                    <EditComment
                      selectedComment={selectedComment}
                      handleClose={handleClose}
                    />
                  )}
                </Box>
              </Modal>
            }
            <p>{comment.user.username}</p>

            <p dangerouslySetInnerHTML={{ __html: comment.comment }}></p>

            <p>Upvote {comment.upVote.count}</p>
            <button
              onClick={() => {
                likeMutation.mutate(comment._id);
              }}
            >
              {comment.upVote.userIds.find((userId) => {
                return userId.toString() === user.id;
              })
                ? "UnLike"
                : "Like"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Comment;

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
import EditIcon from "@mui/icons-material/Edit";
import { Button, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
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
          <Button
            variant="contained"
            type="submit"
            sx={{
              margin: "8px 0",
            }}
          >
            Add Comment
          </Button>
        )}
      </form>
      {data?.data.comments.map((comment) => {
        return (
          <div
            key={comment._id}
            style={{
              border: "2px solid black",
              borderRadius: "15px",
              margin: "8px 0",
              padding: "8px 8px",
            }}
          >
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">{comment.user.username}</Typography>
              {user.id === comment.user._id && (
                <>
                  <IconButton
                    type="button"
                    onClick={() => {
                      setSelectedComment(comment);
                      handleOpen();
                    }}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    type="button"
                    onClick={() => {
                      deleteMutation.mutate(comment._id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
            </div>

            <Typography variant="body1">
              <p dangerouslySetInnerHTML={{ __html: comment.comment }}></p>
            </Typography>

            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton
                onClick={() => {
                  likeMutation.mutate(comment._id);
                }}
              >
                {comment.upVote.userIds.find((userId) => {
                  return userId.toString() === user.id;
                }) ? (
                  <ThumbUpAltIcon />
                ) : (
                  <ThumbUpOffAltIcon />
                )}
              </IconButton>
              <p
                style={{
                  fontSize: "22px",
                }}
              >
                {comment.upVote.count > 0 && comment.upVote.count}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Comment;

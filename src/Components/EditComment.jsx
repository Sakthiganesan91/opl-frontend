import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { request } from "../global/axiosGlobal";
import { authContext } from "../hooks/authContext";
import "react-quill/dist/quill.snow.css";

function EditComment({ selectedComment, handleClose }) {
  const [comment, setComment] = useState(selectedComment);
  const queryClient = useQueryClient();
  const { user } = useContext(authContext);
  const [updatedComment, setUpdatedComment] = useState(selectedComment.comment);

  useEffect(() => {
    request
      .get(`/comment/${comment.roomId}/${comment.queryId}/${comment._id}`, {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {});
  }, []);

  const mutation = useMutation({
    mutationFn: (com) => {
      return request.put(
        `/comment/${comment.roomId}/${comment.queryId}/${comment._id}`,
        {
          com,
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
        queryKey: ["comments", comment.roomId, comment.queryId],
      });
      console.log("updated");
      setComment("");
      handleClose();
    },
  });

  const submitHandler = (event) => {
    event.preventDefault();

    if (updatedComment.includes("<p><br></p>")) return;

    mutation.mutate(updatedComment);
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <ReactQuill
          theme="snow"
          value={updatedComment}
          onChange={setUpdatedComment}
          style={{
            display: "flex",
            flexDirection: "column",
            overflowX: "clip",
            overflowWrap: "break-word",
            wordWrap: "break-word",
            wordBreak: "break-word",
          }}
        />

        <button type="submit">Update Comment</button>
        <button
          type="button"
          onClick={() => {
            handleClose();
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditComment;

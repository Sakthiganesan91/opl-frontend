import { useMutation } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import ReactQuill from "react-quill";
import { request } from "../global/axiosGlobal";
import { authContext } from "../hooks/authContext";

function AddComment({ roomId, queryId }) {
  const { user } = useContext(authContext);
  const [comment, setComment] = useState("<p><br></p>");

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
      console.log(data.data.message);
      queryClient.invalidateQueries({
        queryKey: ["comments", roomId, queryId],
      });
      setComment("");
    },
  });

  const submitHandler = (event) => {
    event.preventDefault();

    if (comment === "<p><br></p>") return;

    console.log(comment);

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
          <button type="submit">Add Comment</button>
        )}
      </form>
    </div>
  );
}

export default AddComment;

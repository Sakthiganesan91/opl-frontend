import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { request } from "../global/axiosGlobal";
import { authContext } from "../hooks/authContext";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function UpdateQueryForm({ query, handleClose }) {
  const queryClient = useQueryClient();
  const { user } = useContext(authContext);
  const [queryTitle, setQueryTitle] = useState(query.title);
  const [queryDescription, setQueryDescription] = useState(query.description);
  const [queryDetails, setQueryDetails] = useState(query.detailsWanted);
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: ({ queryTitle, queryDescription, queryDetails }) => {
      return request.put(
        `/chat/${query.roomId}/${query._id}`,
        {
          queryTitle,
          queryDescription,
          queryDetails,
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
        queryKey: ["query", query.roomId, query._id],
      });

      handleClose();
    },
  });

  const queryTitleHandler = (event) => {
    setQueryTitle(event.target.value);
  };

  const queryDescriptionHandler = (event) => {
    setQueryDescription(event.target.value);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    if (queryTitle.length < 1 || queryDescription.length < 1) {
      setError("Fill Required Details Details");
      return;
    }

    mutation.mutate({ queryTitle, queryDescription, queryDetails });

    setQueryDetails("");
    setQueryTitle("");
    setQueryDescription("");
  };
  return (
    <div>
      <div>{query.roomId}</div>
      <form onSubmit={submitHandler}>
        <div>
          <label>Query Title</label>
          <div>
            <input
              type="text"
              value={queryTitle}
              onChange={queryTitleHandler}
            />
          </div>
        </div>
        <div>
          <label>Query Description</label>
          <div>
            <input
              type="text"
              value={queryDescription}
              onChange={queryDescriptionHandler}
            />
          </div>
        </div>

        <div>
          <ReactQuill
            theme="snow"
            value={queryDetails}
            onChange={setQueryDetails}
            style={{
              display: "flex",
              flexDirection: "column",
              overflowX: "clip",
              overflowWrap: "break-word",
              wordWrap: "break-word",
              wordBreak: "break-word",
            }}
          />
        </div>

        <div>
          <button type="submit">Update Query</button>
          <button type="button" onClick={() => handleClose()}>
            Cancel
          </button>
          {error && <h5>{error}</h5>}
        </div>
      </form>
    </div>
  );
}

export default UpdateQueryForm;

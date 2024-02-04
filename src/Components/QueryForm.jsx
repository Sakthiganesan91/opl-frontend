import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { request } from "../global/axiosGlobal";
import { authContext } from "../hooks/authContext";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function QueryForm({ room, setIsOpen }) {
  const queryClient = useQueryClient();
  const { user } = useContext(authContext);
  const [queryTitle, setQueryTitle] = useState("");
  const [queryDescription, setQueryDescription] = useState("");
  const [queryDetails, setQueryDetails] = useState("");
  const [error, setError] = useState("");

  const queryTitleHandler = (event) => {
    setQueryTitle(event.target.value);
  };

  const queryDescriptionHandler = (event) => {
    setQueryDescription(event.target.value);
  };

  const mutation = useMutation({
    mutationFn: ({ queryTitle, queryDescription, queryDetails }) => {
      return request.post(
        `/chat/${room.toLowerCase()}`,
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
        queryKey: ["queries", room.toLowerCase()],
      });
      setIsOpen(false);
    },
    onError: (error) => {
      console.log(error.response);
    },
  });

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
          <button type="submit">Submit Query</button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Cancel
          </button>
          {error && <h5>{error}</h5>}
        </div>
      </form>
    </div>
  );
}

export default QueryForm;

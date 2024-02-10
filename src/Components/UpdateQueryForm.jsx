import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { request } from "../global/axiosGlobal";
import { authContext } from "../hooks/authContext";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Box, Button, TextField, Typography } from "@mui/material";

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
    <Box
      sx={{
        margin: {
          xs: "0 16px",
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          margin: "8px 0",
        }}
      >
        Update Query
      </Typography>
      <form onSubmit={submitHandler}>
        <div>
          <div
            style={{
              margin: "16px 0",
            }}
          >
            <TextField
              label="Query Title"
              variant="standard"
              type="text"
              fullWidth
              required
              value={queryTitle}
              onChange={queryTitleHandler}
            />
          </div>
        </div>
        <div>
          <div
            style={{
              margin: "16px 0",
            }}
          >
            <TextField
              label="Query Description"
              multiline
              fullWidth
              required
              variant="standard"
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
          />
        </div>

        <div
          style={{
            margin: "4px 0",
          }}
        >
          <Button type="submit" variant="contained">
            Update Query
          </Button>
          <Button type="button" onClick={() => handleClose()} variant="text">
            Cancel
          </Button>
          {error && <h5>{error}</h5>}
        </div>
      </form>
    </Box>
  );
}

export default UpdateQueryForm;

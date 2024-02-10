import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { request } from "../global/axiosGlobal";
import { authContext } from "../hooks/authContext";
import TextField from "@mui/material/TextField";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Box, Button, Grid } from "@mui/material";

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
    <Box component={"div"}>
      <form onSubmit={submitHandler} autoComplete="false">
        <TextField
          variant="standard"
          label="Query Title"
          type="text"
          multiline
          fullWidth
          autoComplete="off"
          value={queryTitle}
          onChange={queryTitleHandler}
        />

        <TextField
          variant="standard"
          label="Query Description"
          type="text"
          multiline
          fullWidth={true}
          value={queryDescription}
          onChange={queryDescriptionHandler}
        />

        <Box
          component={"div"}
          sx={{
            margin: { sm: "8px 0" },
          }}
        >
          <ReactQuill
            theme="snow"
            style={{
              width: "100%",
            }}
            value={queryDetails}
            onChange={setQueryDetails}
          />
        </Box>

        <Box
          sx={{
            display: {
              sm: "flex",
            },
            margin: {
              xs: "8px 0",
            },
            marginBottom: {
              sm: "16px",
            },
            justifyContent: { sm: "center" },
            alignItems: { sm: "center" },
          }}
        >
          <Button
            variant="contained"
            type="submit"
            endIcon={<ArrowUpwardIcon />}
          >
            Submit Query
          </Button>
          <Button
            variant="text"
            type="button"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
          {error && <h5>{error}</h5>}
        </Box>
      </form>
    </Box>
  );
}

export default QueryForm;

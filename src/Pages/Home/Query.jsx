import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import Comment from "../../Components/Comment";
import { request } from "../../global/axiosGlobal";
import { authContext } from "../../hooks/authContext";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import UpdateQueryForm from "../../Components/UpdateQueryForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function Query() {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const queryClient = useQueryClient();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  let { room, queryId } = useParams();
  const { user } = useContext(authContext);

  const { data } = useQuery({
    queryKey: ["query", room, queryId],
    queryFn: () => {
      return request.get(`/chat/${room.toLowerCase()}/${queryId}`, {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      });
    },
  });

  const { data: isQuerySaved } = useQuery({
    queryKey: ["savedQuery", queryId],
    queryFn: () => {
      return request.get(`/is-post-saved/${queryId}`, {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      });
    },
    enabled: !!data?.data?.query?._id,
  });

  const saveQueryMutation = useMutation({
    mutationFn: () => {
      return request.post(
        `/save-post/${queryId}`,
        {},
        {
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        }
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["savedQuery", queryId] });
    },
    onError: (err) => {
      console.log(err.response.data.error);
    },
  });

  const deleteQueryMutation = useMutation({
    mutationFn: () => {
      return request.delete(`/save-post/${queryId}`, {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["savedQuery", queryId] });
    },
    onError: (err) => {
      console.log(err.response.data.error);
    },
  });

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
        queryKey: ["query", room, queryId],
      });
    },
    onError: (err) => {
      console.log(err.response);
    },
  });

  return (
    <div
      style={{
        border: "1px solid black",
      }}
    >
      <div
        style={{
          display: "flex",
        }}
      >
        <p>{data?.data?.query?.user?.username}</p>
        {isQuerySaved?.data.isQueryPresent ? (
          <button
            onClick={() => {
              deleteQueryMutation.mutate();
            }}
          >
            Delete From Saved Post
          </button>
        ) : (
          <button
            onClick={() => {
              saveQueryMutation.mutate();
            }}
          >
            Save Post
          </button>
        )}

        {user.id === data?.data?.query.user._id && (
          <button onClick={handleOpen}>Update</button>
        )}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {data?.data?.query && (
              <UpdateQueryForm
                query={data?.data?.query}
                handleClose={handleClose}
              />
            )}
          </Box>
        </Modal>
      </div>

      <div>
        <button
          onClick={() => {
            likeMutation.mutate(data?.data.query._id);
          }}
        >
          {data?.data.query.useful.userIds.find((userId) => {
            return userId.toString() === user.id;
          })
            ? "unUseful"
            : "useful"}
        </button>

        <p>
          {data?.data.query.useful.usefulCount > 0 &&
            data?.data.query.useful.usefulCount}
        </p>
      </div>
      <h1>{data?.data?.query.title}</h1>
      <h2>{data?.data?.query.description}</h2>
      <p
        dangerouslySetInnerHTML={{ __html: data?.data?.query.detailsWanted }}
      ></p>
      <h4>Comments</h4>
      <Comment roomId={room} queryId={queryId} />
    </div>
  );
}

export default Query;

import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import Comment from "../../Components/Comment";
import { request } from "../../global/axiosGlobal";
import { authContext } from "../../hooks/authContext";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import UpdateQueryForm from "../../Components/UpdateQueryForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IconButton } from "@mui/material";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import EditIcon from "@mui/icons-material/Edit";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
function Query() {
  const theme = useTheme();
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
    <Box
      sx={{
        margin: {
          xs: "4px",
          md: "4px 10%",
          lg: "2px 25%",
        },
        borderRadius: "10px",
        border: "2px solid black",
      }}
    >
      <Box
        sx={{
          padding: theme.spacing(2),
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: theme.spacing(2),
          }}
        >
          <Typography variant="h4">
            {data?.data?.query?.user?.username}
          </Typography>
          {isQuerySaved?.data.isQueryPresent ? (
            <IconButton onClick={deleteQueryMutation.mutate}>
              <BookmarkAddedIcon fontSize="large" />
            </IconButton>
          ) : (
            <IconButton onClick={saveQueryMutation.mutate}>
              <BookmarkAddOutlinedIcon fontSize="large" />
            </IconButton>
          )}
          {user.id === data?.data?.query.user._id && (
            <IconButton variant="contained" onClick={handleOpen}>
              <EditIcon fontSize="large" />
            </IconButton>
          )}
          <IconButton onClick={() => likeMutation.mutate(data?.data.query._id)}>
            {data?.data.query.useful.userIds.find(
              (userId) => userId.toString() === user.id
            ) ? (
              <StarIcon fontSize="large" />
            ) : (
              <StarOutlineIcon fontSize="large" />
            )}
          </IconButton>

          <span
            style={{
              fontSize: "24px",
              fontFamily: "Comic Sans MS, Comic Sans, cursive",
            }}
          >
            {data?.data.query.useful.usefulCount > 0 &&
              data?.data.query.useful.usefulCount}
          </span>
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
        </Box>

        <Box sx={{ marginBottom: theme.spacing(2) }}></Box>

        <Typography variant="h5">Query Title</Typography>
        <Typography variant="body1">{data?.data?.query.title}</Typography>
        <Typography variant="h5">Query Description</Typography>
        <Typography variant="body1">{data?.data?.query.description}</Typography>
        <Typography variant="h5">Query Details</Typography>
        <Typography
          variant="body1"
          sx={{
            margin: "8px 0",
          }}
          dangerouslySetInnerHTML={{ __html: data?.data?.query.detailsWanted }}
        ></Typography>

        <Typography
          variant="caption"
          sx={{
            mx: "4px",
          }}
        >
          Posted : {data?.data?.query.createdAt.split("T")[0]}
        </Typography>

        {data?.data?.query.updatedAt && (
          <Typography
            variant="caption"
            sx={{
              mx: "4px",
            }}
          >
            Edited : {data?.data?.query.updatedAt.split("T")[0]}
          </Typography>
        )}

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography variant="h5">Comments</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Comment roomId={room} queryId={queryId} />
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}

export default Query;

// <div
//   style={{
//     border: "1px solid black",
//   }}
// >
//   <div
//     style={{
//       display: "flex",
//     }}
//   >
//     <p>{data?.data?.query?.user?.username}</p>
//     {isQuerySaved?.data.isQueryPresent ? (
//       <button
//         onClick={() => {
//           deleteQueryMutation.mutate();
//         }}
//       >
//         Delete From Saved Post
//       </button>
//     ) : (
//       <button
//         onClick={() => {
//           saveQueryMutation.mutate();
//         }}
//       >
//         Save Post
//       </button>
//     )}

//     {user.id === data?.data?.query.user._id && (
//       <button onClick={handleOpen}>Update</button>
//     )}
//     <Modal
//       open={open}
//       onClose={handleClose}
//       aria-labelledby="modal-modal-title"
//       aria-describedby="modal-modal-description"
//     >
//       <Box sx={style}>
//         {data?.data?.query && (
//           <UpdateQueryForm
//             query={data?.data?.query}
//             handleClose={handleClose}
//           />
//         )}
//       </Box>
//     </Modal>
//   </div>

//   <div>
//     <button
//       onClick={() => {
//         likeMutation.mutate(data?.data.query._id);
//       }}
//     >
//       {data?.data.query.useful.userIds.find((userId) => {
//         return userId.toString() === user.id;
//       })
//         ? "unUseful"
//         : "useful"}
//     </button>

//     <p>
//       {data?.data.query.useful.usefulCount > 0 &&
//         data?.data.query.useful.usefulCount}
//     </p>
//   </div>
//   <h1>{data?.data?.query.title}</h1>
//   <h2>{data?.data?.query.description}</h2>
//   <p
//     dangerouslySetInnerHTML={{ __html: data?.data?.query.detailsWanted }}
//   ></p>
//   <h4>Comments</h4>
//   <Comment roomId={room} queryId={queryId} />
// </div>

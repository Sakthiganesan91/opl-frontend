import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../../global/axiosGlobal";
import { useContext } from "react";
import { authContext } from "../../hooks/authContext";

function AddRoom() {
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

  const [roomName, setRoomName] = useState("");
  const { user } = useContext(authContext);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (room) => {
      return request.post(
        `/add-room/${user.id}`,
        {
          room: room,
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

      queryClient.invalidateQueries({ queryKey: ["user", user.id] });
      handleClose();
    },
    onError: (error) => {
      console.log(error.response.data);
    },
  });
  return (
    <div>
      <button
        onClick={() => {
          handleOpen();
        }}
      >
        Join Room
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Join Room
          </Typography>

          <br />
          <div>
            <TextField
              id="room"
              label="Room Name"
              variant="standard"
              value={roomName}
              onChange={(event) => {
                setRoomName(event.target.value);
              }}
            />
          </div>

          <div>
            <br />
            <button
              onClick={() => {
                mutation.mutate(roomName.toLowerCase());
                setRoomName("");
                handleClose();
              }}
            >
              Join Room
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default AddRoom;

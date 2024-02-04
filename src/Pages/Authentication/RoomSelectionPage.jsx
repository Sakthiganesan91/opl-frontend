import React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Multiselect from "multiselect-react-dropdown";
import { useMutation } from "@tanstack/react-query";
import { request } from "../../global/axiosGlobal";

function RoomSelectionPage() {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = state.user;

  const options = [
    { name: "js", id: "js" },
    { name: "react", id: "react" },
    { name: "angular", id: "angular" },
    { name: "python", id: "python" },
    { name: "java", id: "java" },
    { name: "c", id: "c" },
    { name: "jee", id: "jee" },
    { name: "html", id: "html" },
    { name: "neet", id: "neet" },
  ];

  const onSelect = (selectedList) => {
    if (selectedList.length > 5) {
      setError(true);
      return;
    }
    setError(false);
    setSelectedRooms(selectedList);
  };

  const onRemove = (selectedList) => {
    if (selectedList.length <= 5) {
      setError(false);
      return;
    }
  };

  const mutation = useMutation({
    mutationFn: (user) => {
      request.post("/signup", {
        ...user,
      });
    },
    onSuccess: () => {
      navigate("/");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const submitHandler = () => {
    console.log(selectedRooms);

    if (selectedRooms.length < 1) {
      setErrorMessage("Select atleast 1 Room");
      return;
    }
    setErrorMessage("");

    console.log({ ...user, rooms: selectedRooms });

    mutation.mutate({ ...user, rooms: selectedRooms });
  };

  return (
    <div>
      <div>
        <label>Select Rooms</label>
      </div>
      <Multiselect
        options={options}
        onSelect={onSelect}
        displayValue="name"
        onRemove={onRemove}
      />

      {error ? <h2>Can Select Only Upto 5 Rooms</h2> : ""}

      <button onClick={submitHandler} disabled={error}>
        Finish Sign Up
      </button>

      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default RoomSelectionPage;

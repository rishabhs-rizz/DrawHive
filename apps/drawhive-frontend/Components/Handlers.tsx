"use client";
import axios from "axios";
import { useRouter } from "next/navigation";

export const handleCreateRoom = async (
  roomName: string,
  setRoomId: React.Dispatch<React.SetStateAction<string>>
) => {
  if (!roomName) return alert("Enter room name");
  console.log("Creating room with name:", roomName);
  const token = localStorage.getItem("token");
  const response = await axios.post(
    "http://localhost:5000/createRoom",
    { name: roomName },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = response.data;
  const roomId = data.roomID;
  setRoomId(roomId);
  navigator.clipboard.writeText(roomId);
};

export const handleCopy = (roomId: string) => {
  navigator.clipboard.writeText(roomId);
  alert("roomId copied to clipboard!");
};

export const handleJoinRoom = (
  roomId: string,
  router: ReturnType<typeof useRouter>
) => {
  if (!roomId) return alert("Enter room ID");
  // console.log("Joining room with ID:", roomId);
  // const token = localStorage.getItem("token");
  // const response = await axios.get(`http://localhost:5000/room/${roomId}`, {
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`,
  //   },
  // });
  // const data = response.data;
  // console.log("Room data:", data);

  router.push(`/canvas/${roomId}`);
};

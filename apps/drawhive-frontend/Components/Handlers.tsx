"use client";
import axios from "axios";
import { useRouter } from "next/navigation";

export const handleCreateRoom = async (roomName: string) => {
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
  if (response) {
    const link = response.data.link;
    const roomID = response.data.roomID;
    console.log("here's the link : " + link, "roomID " + roomID);
    return { link, roomID };
  }
};

export const handleCopy = (link: string) => {
  navigator.clipboard.writeText(link);
};

export const handleJoinRoom = async (
  link: string,
  roomId: string,
  router: ReturnType<typeof useRouter>
) => {
  if (!link) return alert("Enter the link");
  console.log("Joining room with the link:", link);
  const token = localStorage.getItem("token");
  const response = await axios.get(`http://localhost:5000/room/${link}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = response.data;
  console.log("Room data:", data);

  router.push(`/canvas/${roomId}`);
};

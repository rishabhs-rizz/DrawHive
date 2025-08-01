"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
    const createdAt = response.data.createdAt;
    console.log("here's the link : " + link, "roomID " + roomID);
    return { link, roomID, createdAt };
  }
};

export const handleCopy = (link: string) => {
  navigator.clipboard.writeText(link);
  toast.success("Copied to clipboard");
};

export const handleJoinRoom = async (
  link: string,
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
  const roomId = data.id;
  router.push(`/canvas/${roomId}`);
  toast.success("Joining room...");
};

export const HandleFetchingAllRooms = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:5000/allRooms", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response) {
      return response;
    }
  } catch (e) {
    console.log("error in fetching all rooms" + e);
  }
};

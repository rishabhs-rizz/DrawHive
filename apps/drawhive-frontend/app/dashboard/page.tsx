"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

import {
  handleCopy,
  handleCreateRoom,
  HandleFetchingAllRooms,
  handleJoinRoom,
} from "@/Components/Handlers";
import { MainIcon } from "@/Components/MainIcon";
import { RoomCard } from "@/Components/RoomCard";
import { GithubIcon, ThemeIcon, TwitterIcon } from "@/Components/ThemeIcon";

export default function Dashboard() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setJoinModalOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [link, setLink] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await HandleFetchingAllRooms();
      if (response?.data) {
        setRooms(response.data);
      }
      setLoading(false);
    };

    fetchRooms();

    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300 relative">
      {/* Header */}
      <header className="border-b border-black shadow-sm bg-background transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="flex items-center gap-1 text-2xl italic font-medium text-foreground">
              <MainIcon dark={darkMode} />
              DrawHive
            </h1>
            <div className="flex items-center gap-4">
              <span onClick={toggleTheme} className="cursor-pointer">
                <ThemeIcon dark={darkMode} />
              </span>
              <a href="https://x.com/rishabhs_rizz" target="blank_">
                <TwitterIcon dark={darkMode} />
              </a>

              <a href="https://github.com/rishabhs-rizz" target="blank_">
                <GithubIcon dark={darkMode} />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Room Display */}
      <main className="p-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center text-foreground mt-10">
            Loading rooms...
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-white bg-blue-400 text-center w-fit px-4 py-2 rounded-md mx-auto mt-10 text-lg">
            No Room has been joined yet
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {rooms.map((room, index) => (
              <RoomCard
                key={room.id || index}
                slug={room.slug}
                createdAt={room.createdAt}
                link={room.link}
                roomId={room.id}
                router={router}
                darkMode={darkMode}
              />
            ))}
          </div>
        )}
      </main>

      {/* Bottom Buttons */}
      <div className="fixed bottom-10 right-10 flex gap-2">
        <button
          onClick={() => setCreateModalOpen(true)}
          className="bg-[#B2AEFF] dark:bg-[#918cfb] hover:bg-[#a29ef9] px-4 py-2 rounded text-sm font-medium"
        >
          Create Room
        </button>
        <button
          onClick={() => setJoinModalOpen(true)}
          className="border px-4 py-2 rounded text-sm font-medium bg-background hover:bg-white/10 text-foreground"
        >
          Join Room
        </button>
      </div>

      {/* Join Modal */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setJoinModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-2">Join Room</h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter the room ID to join an existing room.
            </p>
            <input
              className="w-full px-4 py-2 border rounded mb-2"
              placeholder="Enter the link"
              onChange={(e) => setLink(e.target.value)}
            />
            <button
              onClick={() => {
                handleJoinRoom(link, roomId, router);
              }}
              className="bg-black text-white px-4 py-2 rounded w-full hover:bg-gray-800"
            >
              Join Room
            </button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setCreateModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-2">Create Room</h2>
            <p className="text-sm text-gray-600 mb-4">
              Create your own room and collaborate with friends by sharing the
              room ID.
            </p>
            <input
              className="w-full px-4 py-2 border rounded mb-2"
              placeholder="Enter your room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <div className="flex items-center space-x-2 mb-4">
              <input
                className="flex-1 px-4 py-2 border rounded"
                value={link}
                readOnly
                placeholder="Generated link"
              />
              <button
                onClick={() => {
                  handleCopy(link);
                }}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded"
              >
                Copy
              </button>
            </div>
            <button
              onClick={async () => {
                setClicked(true);
                const response = await handleCreateRoom(roomName);
                if (response?.link && response.roomID) {
                  setLink(response.link);
                  setRoomId(response.roomID);
                  toast.success("Room created successfully!");
                } else {
                  toast.error("Failed to create room!");
                }
                setClicked(false);
              }}
              className="bg-black text-white px-4 py-2 rounded w-full hover:bg-gray-800"
            >
              {clicked ? "Creating..." : "Create Room"}
            </button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

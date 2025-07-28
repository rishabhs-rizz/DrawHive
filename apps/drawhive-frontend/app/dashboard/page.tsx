"use client";

import {
  handleCopy,
  handleCreateRoom,
  handleJoinRoom,
} from "@/Components/Handlers";
import { MainIcon } from "@/Components/MainIcon";
import { GithubIcon, ThemeIcon, TwitterIcon } from "@/Components/ThemeIcon";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function Dashboard() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setJoinModalOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [link, setLink] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [clicked, setClicked] = useState(false);
  const router = useRouter();

  useEffect(() => {
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
      <span className="bottom-10 right-10 absolute flex gap-2">
        <button
          onClick={() => setCreateModalOpen(true)}
          className="bg-[#B2AEFF] dark:bg-[#918cfb] hover:bg-[#a29ef9] p-2 rounded cursor-pointer"
        >
          Create Room
        </button>
        <button
          onClick={() => setJoinModalOpen(true)}
          className="border p-2 rounded cursor-pointer bg-background hover:!bg-white/10 text-foreground"
        >
          Join Room
        </button>
      </span>
      {/* Main Content */}
      <header className="border-b-black border-b shadow-sm bg-background dark:bg-background transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="flex gap-0 items-center text-2xl font-sans italic font-medium text-foreground dark:text-foreground">
              <MainIcon dark={darkMode} />
              DrawHive
            </h1>
            <div className="flex items-center gap-4">
              <span onClick={toggleTheme}>
                <ThemeIcon dark={darkMode} />
              </span>
              <TwitterIcon dark={darkMode} />
              <GithubIcon dark={darkMode} />
            </div>
          </div>
        </div>
      </header>

      {isJoinModalOpen && (
        <div>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white text-black rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
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
                  toast.success("Joining room...");
                }}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded"
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => setCreateModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-2">Create Room</h2>
            <p className="text-sm text-gray-600 mb-4">
              Create your own room and collaborate with friends by sharing the
              room-Id.
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
                placeholder="link"
              />
              <button
                onClick={() => {
                  handleCopy(link);
                  toast.success("Copied to Clipboard!");
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
                  setClicked(false);
                } else {
                  toast.error("Failed to create room!");
                }
              }}
              className="bg-black text-white px-4 py-2 rounded w-full hover:bg-gray-800"
            >
              {clicked ? "Loading..." : "Create Room"}
            </button>
            <ToastContainer />
          </div>
        </div>
      )}
    </div>
  );
}

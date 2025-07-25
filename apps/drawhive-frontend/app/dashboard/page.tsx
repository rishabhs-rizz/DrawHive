"use client";

import {
  handleCopy,
  handleCreateRoom,
  handleJoinRoom,
} from "@/Components/Handlers";
import { MainIcon } from "@/Components/MainIcon";
import { GithubIcon, ThemeIcon, TwitterIcon } from "@/Components/ThemeIcon";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function Dashboard() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setJoinModalOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");

  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "guest";
  const email = searchParams.get("email") || "email not provided";
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-black relative">
      <span className="bottom-10 right-10 absolute flex gap-2">
        <button
          onClick={() => setCreateModalOpen(true)}
          className="bg-[#B2AEFF] hover:bg-[#a29ef9] p-2 rounded cursor-pointer"
        >
          Create Room
        </button>
        <button
          onClick={() => setJoinModalOpen(true)}
          className="bg-[#F3F4F6] hover:bg-[#e4eaf7] p-2 rounded cursor-pointer dark:bg-lightbg "
        >
          Join Room
        </button>
      </span>
      {/* Main Content */}
      <header className="border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="flex gap-0 items-center text-2xl font-sans italic font-medium bg-background text-foreground dark:bg-background dark:text-foreground">
              <MainIcon />
              DrawHive
            </h1>
            <div className="flex items-center gap-4">
              <ThemeIcon />
              <TwitterIcon />
              <GithubIcon />
            </div>
          </div>
        </div>
      </header>

      {isJoinModalOpen && (
        <div>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
                placeholder="Enter room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <button
                onClick={() => {
                  handleJoinRoom(roomId, router);
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
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
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
                value={roomId}
                readOnly
                placeholder="RoomId"
              />
              <button
                onClick={() => handleCopy(roomId)}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded"
              >
                Copy
              </button>
            </div>
            <button
              onClick={() => {
                handleCreateRoom(roomName, setRoomId);
                toast.success("Room created successfully!");
              }}
              className="bg-black text-white px-4 py-2 rounded w-full hover:bg-gray-800"
            >
              Create Room
            </button>
            <ToastContainer />
          </div>
        </div>
      )}
    </div>
  );
}

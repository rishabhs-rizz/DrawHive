"use client";

import { handleCopy, handleCreateRoom } from "@/Components/Handlers";
import { useSearchParams } from "next/navigation";
import React, { use, useState } from "react";

export default function Dashboard() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [slug, setSlug] = useState("");

  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "guest";
  const email = searchParams.get("email") || "email not provided";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-4 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-4">🖋️ DrawHivee</h1>
          <p className="text-sm text-gray-400">Enterprise</p>
        </div>
        <div>
          <p className="text-sm">{name}</p>
          <p className="text-xs text-gray-400">{email}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center">
          <div className="text-lg"> 🗂️ Doodleboard &gt; 📌 Dashboard</div>
          <div className="space-x-2">
            <button
              className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded"
              onClick={() => alert("Join Room feature coming soon!")}
            >
              Join Room
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
              onClick={() => setModalOpen(true)}
            >
              Create Room
            </button>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white text-black rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setModalOpen(false)}
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-2">Create Room</h2>
              <p className="text-sm text-gray-600 mb-4">
                Create your own room and collaborate with friends by sharing the
                room slug.
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
                  value={slug}
                  readOnly
                  placeholder="RoomId"
                />
                <button
                  onClick={() => handleCopy(slug)}
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded"
                >
                  Copy
                </button>
              </div>
              <button
                onClick={() => handleCreateRoom(roomName, slug, setSlug)}
                className="bg-black text-white px-4 py-2 rounded w-full hover:bg-gray-800"
              >
                Create Room
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { handleCopy, handleJoinRoom } from "./Handlers";
import { useRouter } from "next/navigation";

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = (date.getTime() - now.getTime()) / 1000;

  const intervals: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "seconds"],
    [60 * 60, "minutes"],
    [60 * 60 * 24, "hours"],
    [60 * 60 * 24 * 7, "days"],
    [60 * 60 * 24 * 30, "weeks"],
    [60 * 60 * 24 * 365, "months"],
    [Infinity, "years"],
  ];

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (let i = 0; i < intervals.length; i++) {
    const [threshold, unit] = intervals[i];
    const prevThreshold = i === 0 ? 1 : intervals[i - 1][0];
    if (Math.abs(diff) < threshold) {
      const value = Math.round(diff / prevThreshold);
      return formatter.format(value, unit);
    }
  }

  return "some time ago";
}

export function RoomCard({
  slug,
  createdAt,
  link,
  roomId,
  router,
  darkMode,
}: {
  slug: string;
  createdAt: string;
  link: string;
  roomId: string;
  router: ReturnType<typeof useRouter>;
  darkMode: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [relativeTime, setRelativeTime] = useState("");

  useEffect(() => {
    setRelativeTime(getRelativeTime(createdAt));
  }, [createdAt]);

  return (
    <div
      className={`max-w-sm w-full ${darkMode ? "bg-zinc-900" : "bg-white"} shadow-lg rounded-xl p-5 border ${darkMode ? "border-zinc-700" : "border-gray-500"} transition-all space-y-4 duration-300`}
    >
      <div>
        <div
          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mb-1 transition-colors duration-300`}
        >
          Room Name
        </div>
        <h2
          className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"} capitalize transition-colors duration-300`}
        >
          {slug}
        </h2>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <input
            readOnly
            className={`flex-1 px-3 py-2 rounded-md ${darkMode ? "bg-zinc-800 text-gray-300 border-zinc-600 " : "bg-gray-100 text-gray-700 border-gray-300 "} text-sm border focus:outline-none transition-colors duration-300`}
            value={link}
          />
          <button
            onClick={() => {
              setCopied(false);
              handleCopy(link);
              setCopied(true);
            }}
            className="px-3 py-2 rounded-md bg-gray-800 text-white text-sm hover:bg-gray-700 transition-colors"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <button
        onClick={() => handleJoinRoom(link, roomId, router)}
        className="w-full px-4 py-2 rounded-md bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
      >
        Join Room
      </button>

      <div
        className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-700"} text-right`}
      >
        Created {relativeTime}
      </div>
    </div>
  );
}

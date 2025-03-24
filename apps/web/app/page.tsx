"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const [RoomId, setRoomId] = useState("");
  const router = useRouter();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <input
        style={{ padding: "10" }}
        value={RoomId}
        onChange={(e) => {
          setRoomId(e.target.value);
        }}
        type="text"
        placeholder="Room Id"
      />

      <button
        style={{ padding: "10" }}
        onClick={() => {
          router.push(`/room/${RoomId}`);
        }}
      >
        c'mon Join room
      </button>
    </div>
  );
}

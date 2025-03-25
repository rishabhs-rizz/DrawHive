"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const [slug, setSlug] = useState("");
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
        style={{ padding: "3vh" }}
        value={slug}
        onChange={(e) => {
          setSlug(e.target.value);
        }}
        type="text"
        placeholder="Room Id"
      />

      <button
        style={{ padding: "3vh" }}
        onClick={() => {
          router.push(`/room/${slug}`);
        }}
      >
        c'mon Join room
      </button>
    </div>
  );
}

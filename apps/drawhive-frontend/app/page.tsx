"use client";
import { useRouter } from "next/navigation";
import signUp from "./signup/page";

export default function Home() {
  const router = useRouter();
  router.push("/signup");
}

"use client";
import React from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { Bounce, toast, ToastContainer } from "react-toastify";

export function Authpage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="p-8 bg-white rounded-lg shadow-lg w-96">
          <h1 className="text-2xl font-bold text-gray-400 text-center mb-6">
            {isSignin ? "Welcome Back!" : "Create an Account"}
          </h1>
          <form className="space-y-4">
            <Input
              placeHolder="Email"
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-400"
              onchange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeHolder="Password sxscdcdc"
              type="Password"
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-400"
              onchange={(e) => setPassword(e.target.value)}
            />
            {!isSignin && (
              <Input
                placeHolder="Name"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-400"
                onchange={(e) => setName(e.target.value)}
              />
            )}
            <Button
              className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                console.log(isSignin ? "Signing In..." : "Signing Up...");

                try {
                  const response = await axios.post(
                    `http://localhost:5000/${isSignin ? "signin" : "signup"}`,
                    {
                      email,
                      password,
                      name,
                    }
                  );

                  if (!isSignin) {
                    const data = response.data;
                    const { message } = data;

                    // Show toast before navigation
                    toast("🦄 User Signed-up Successfully", {
                      position: "top-right",
                      autoClose: 1000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: false,
                      draggable: true,
                      progress: undefined,
                      theme: "dark",
                      transition: Bounce,
                    });

                    // Delay navigation slightly
                    setTimeout(() => {
                      router.push("/signin");
                    }, 1000);
                  }

                  if (isSignin) {
                    const data = response.data;
                    const { token } = data;
                    localStorage.setItem("token", token);

                    // Show toast before navigation
                    toast("🦄 User Signed-in Successfully", {
                      position: "top-right",
                      autoClose: 1000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: false,
                      draggable: true,
                      progress: undefined,
                      theme: "dark",
                      transition: Bounce,
                    });

                    // Delay navigation slightly
                    setTimeout(() => {
                      router.push(`/dashboard?username=${name}&email=${email}`);
                    }, 1000);
                  }
                } catch (error) {
                  console.error("Error:", error);
                  alert("An error occurred. Please try again.");
                }
              }}
            >
              {isSignin ? "Sign In" : "Sign Up"}
            </Button>
          </form>
          <div className="text-center mt-4">
            <p className="text-gray-600">
              {isSignin ? "Don't have an account?" : "Already have an account?"}{" "}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => {
                  router.push(
                    `http://localhost:3000/${isSignin ? "signup" : "signin"}`
                  );
                }}
              >
                {isSignin ? "Sign Up" : "Sign In"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

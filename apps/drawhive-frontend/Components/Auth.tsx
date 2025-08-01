"use client";
import React from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { Eye, EyeOffIcon } from "lucide-react";

export function Authpage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [righticon, setRightIcon] = useState(true);

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
      <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-r from-yellow-50 to-zinc-200">
        <div className="p-8 bg-white rounded-lg shadow-lg w-96">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-600 text-center">
              {isSignin ? "Welcome Back!" : "Create an Account"}
            </h1>
            <p className="text-center mb-6 text-sm text-gray-400">
              welcome to the Drawhive
            </p>
          </div>

          <form className="space-y-4">
            <Input
              placeHolder="Email"
              type="email"
              onchange={(e) => setEmail(e.target.value)}
            />
            <div className="relative w-full">
              <input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 w-full border border-gray-300 rounded-lg text-gray-400"
              />
              {righticon && (
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? <Eye /> : <EyeOffIcon />}
                </div>
              )}
            </div>
            {!isSignin && (
              <Input
                placeHolder="Name"
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-400"
                onchange={(e) => setName(e.target.value)}
              />
            )}
            <Button
              className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
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
                      autoClose: 300,
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
                    }, 100);
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

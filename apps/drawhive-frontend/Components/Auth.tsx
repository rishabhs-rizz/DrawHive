"use client";

import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { useRouter } from "next/navigation";

export function Authpage({ isSignin }: { isSignin: boolean }) {
  const router = useRouter();

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="p-8 bg-white rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isSignin ? "Welcome Back!" : "Create an Account"}
        </h1>
        <form className="space-y-4">
          <Input
            placeHolder="Email"
            type="email"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          <Input
            placeHolder="Password"
            type="password"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
          {!isSignin && (
            <Input
              placeHolder="Confirm Password"
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          )}
          <Button
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              console.log(isSignin ? "Signing In..." : "Signing Up...");
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
                  `http://localhost:5000/${isSignin ? "signin" : "sign"}`
                );
              }}
            >
              {isSignin ? "Sign Up" : "Sign In"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// import { Button } from "@repo/ui/button";
// import { Input } from "@repo/ui/input";
// export function Authpage({ isSignin }: { isSignin: boolean }) {
//   return (
//     <div className="w-screen h-screen flex justify-center items-center">
//       <div className="p-2 m-2 bg-white rounded">
//         <Input placeHolder="Email" type="text"></Input>
//         <Input placeHolder="password" type="password"></Input>
//         <Button
//           children={isSignin ? "sign in" : "sign up"}
//           className={"p-3 bg-blue-400 rounded-2xl"}
//           onClick={() => {}}
//         ></Button>
//       </div>
//     </div>
//   );
// }

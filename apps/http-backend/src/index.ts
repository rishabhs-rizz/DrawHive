import express, { Request, Response } from "express";
import { z } from "zod";
import prisma from "@repo/db/prisma";
import jwt from "jsonwebtoken";
import JWT_SECRET from "@repo/common/config";
import auth_middleWare from "./middleware";
import { AuthRequest } from "./middleware";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.post("/signup", async (req: Request, res: Response) => {
  try {
    const SignUpBody = z.object({
      email: z.string().email(),
      name: z.string().min(2).max(100),
      password: z.string().min(6).max(100),
    });
    const body = SignUpBody.safeParse(req.body);
    console.log(body);
    if (body.success) {
      console.log(body.data.email, body.data.name);
      await prisma.user.create({
        data: {
          email: body.data.email,
          name: body.data.name,
          password: body.data.password,
        },
      });
    }
    res.json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).send("Invalid details provided");
  }
});

const SignInBody = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

app.post("/signin", async (req: Request, res: Response) => {
  const body = SignInBody.safeParse(req.body);

  try {
    if (body.success) {
      console.log(body.data.email, body.data.password);
      const registeredUser = await prisma.user.findFirst({
        where: { email: body.data.email },
      });
      if (registeredUser) {
        console.log(registeredUser);
        const token = jwt.sign({ id: registeredUser.id }, JWT_SECRET);
        res.json({ message: "User signed in successfully", token: token });
      }
    }
  } catch (e) {
    console.error(e);
    res.status(400).send("Invalid credentials provided");
  }
});

app.post(
  "/createRoom",
  auth_middleWare,
  async (req: AuthRequest, res: Response) => {
    const name = req.body.name;

    try {
      if (name && req.id) {
        const room = await prisma.room.create({
          data: {
            slug: name,
            adminId: req.id,
          },
        });
        res.json({ message: "Room created successfully", roomID: room.id });
      } else {
        res.status(400).send("room already exists with this name");
      }
    } catch (error) {
      window.history.back();
    }
  }
);

app.get("/chats/:roomId", async (req: AuthRequest, res: Response) => {
  console.log("req is coming");
  const roomId = req.params.roomId;

  try {
    if (roomId) {
      const chats = await prisma.chat.findMany({
        where: {
          roomID: parseInt(roomId, 10),
        },
        orderBy: {
          id: "desc",
        },
        take: 50,
      });
      res.json({ chats });
    }
  } catch (error) {
    console.error(error);
    res.status(400).send("Invalid room ID");
  }
});

app.get(
  "/room/:slug",
  auth_middleWare,
  async (req: AuthRequest, res: Response) => {
    const slug = req.params.slug;

    try {
      if (slug && req.id) {
        const requiredRoom = await prisma.room.findFirst({
          where: {
            slug: slug,
          },
        });
        res.json(requiredRoom);
      }
    } catch (error) {
      console.error(error);
      res.status(400).send("Invalid room ID");
    }
  }
);

app.listen(5000);

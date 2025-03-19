import express, { Request, Response } from "express";
import { z } from "zod";
import prisma from "@repo/db/prisma";
import jwt from "jsonwebtoken";
import JWT_SECRET from "@repo/common/config";

const app = express();
app.use(express.json());

const SignUpBody = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  password: z.string().min(6).max(100),
});

app.post("/signup", async (req: Request, res: Response) => {
  try {
    const body = SignUpBody.safeParse(req.body);
    if (body.success) {
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

app.post("/signin", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(email, password);
  const registeredUser = await prisma.user.findFirst({
    where: { email: email },
  });
  if (registeredUser) {
    const token = jwt.sign({ id: registeredUser.id }, JWT_SECRET as string);
    res.json({ message: "User signed in successfully", token: token });
  } else {
    res.status(400).send("Invalid credentials provided");
  }
});

app.listen(5000);

import express, { Request, Response } from "express";
import { z } from "zod";
import { connectDB } from "@repo/db/dbCall";

const app = express();
app.use(express.json());

const SignUpBody = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
  name: z.string().min(2).max(100),
});

app.post("/signup", (req: Request, res: Response) => {
  try {
    const body = SignUpBody.parse(req.body);
    console.log(body);
    res.send("Success");
  } catch (error) {
    console.error(error);
    res.status(400).send("Invalid details provided");
  }
});

app.post("/signin", (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(email, password);
});

app.listen(5000);

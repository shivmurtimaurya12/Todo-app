import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "./lib/prisma.js";
import { CreateUserSchema, todoSchema } from "./type.js";
const app = express();
app.use(express.json());



//auth route
app.post("/auth/signup", async (req, res) => {
  const { success, data } = CreateUserSchema.safeParse(req.body);

  if (!success) {
    res.status(411).json({ message: "Incorrect credentials !" });
    return;
  }

  const hashedPassword = await bcrypt.hash(data.password, "mynameisshiv");
  const User = await prisma.user.create({
    data: {
      username: data.username,
      password: hashedPassword,
    },
  });

  console.log(User); // user print
  res.status(200).json({
    msg: "user created  successfully !",
  });
});



//signin
app.get("/auth/signin", async (req, res) => {
  const { success, data } = CreateUserSchema.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      msg: "invalid credentials",
    });
  }


  
  res.json({ msg: "this sign request" });
});

//Todo Route
//get all todos
app.get("/api/Todos", async (req, res) => {
  res.json({});
});

//get single totdos
app.get("/api/:Todo", async (req, res) => {
  res.json({});
});

//create todo
app.post("/api/Todos", async (req, res) => {
  res.json({});
});

//update todo
app.patch("/api/Todos", async (req, res) => {
  res.json({});
});

//delete todo
app.delete("/api/Todos", async (req, res) => {
  res.json({});
});

app.listen(8080, () => {
  console.log("server is listening at port :8080");
});

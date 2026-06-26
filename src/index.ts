import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { prisma } from "./lib/prisma.js";
import { CreateUserSchema } from "./type.js";
const app = express();
app.use(express.json());
dotenv.config();
const PORT = (process.env.PORT as string) || 3030;

//Auth  Route

//SignUp Route
app.post("/auth/signup", async (req, res) => {
  //schema validation
  const { success, data } = CreateUserSchema.safeParse(req.body);

  if (!success) {
    return res.status(411).json({ message: "Incorrect credentials !" });
  }

  const hashedPassword = await bcrypt.hash(
    req.body.password,
    parseInt(process.env.SECRET_PASSWORD as string),
  );

  const User = await prisma.user.create({
    data: {
      username: data.username,
      password: hashedPassword,
    },
  });

  return res.status(200).json({
    User,
  });
});

//SignIn Route
app.get("/auth/signin", async (req, res) => {
  //scheam validating
  const { success, data } = CreateUserSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      msg: "invalid credentials",
    });
  }
  const { username, password } = data;
  const createdUser = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!createdUser) {
    return res.json({ msg: "invalid username or password !" });
  }

  const matchedPassword = await bcrypt.compare(password, createdUser.password);
  //password check
  if (!matchedPassword) {
    return res.json({ msg: "invalid username or password !" });
  }
  const token = jwt.sign(
    { username, password },
    process.env.JWT_SECRET as string,
  );

  return res.json({
    token,
    msg: "User signed Up successfully !",
  });
});

//Todo Route
//get all todos
app.get("/api/todos", async (req, res) => {
  const allUsers = await prisma.user.findMany({
    include: {
      todos: true,
    },
  });
  return res.json({ allUsers });
});

//get single totdos
app.get("/api/:userId", async (req, res) => {
  const { userId } = req.params;
  const userTodo = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      todos: true,
    },
  });
  return res.json({ userTodo });
});

//create todo
app.post("/api/todo", async (req, res) => {
  const { title, description, isCompleted, dueDate } = req.body;
  const createdTodo = await prisma.todos.create({
    data: { title, description, isCompleted, dueDate },
  });

  return res.json({ createdTodo });
});

//update todo
app.patch("/api/:userId", async (req, res) => {
  const { userId } = req.params;
  await prisma.todos.upsert({
    where: {
      id: userId,
    },
    update: req.body,
    create: req.body,
  });
  return res.json({ msg: "updated successfully !" });
});

//delete todo

app.delete("/api/:userId", async (req, res) => {
  const { userId } = req.params;

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return res.json({ msg: "dleted successfully !" });
});

app.listen(PORT, () => {
  console.log(`server is listening at port :${PORT}`);
});

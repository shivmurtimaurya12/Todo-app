import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { prisma } from "./lib/prisma.js";
import { CreateUserSchema, todoSchema } from "./type.js";
const app = express();
app.use(express.json());
dotenv.config();
const PORT = (process.env.PORT as string) || 3030;
// console.log(typeof PORT, PORT);
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
      // password: data.password,
    },
  });

  // console.log(User); // user print
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
app.get("/api/Todos", async (req, res) => {
  res.json({ msg: "this is all todos !" });
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

app.listen(PORT, () => {
  console.log(`server is listening at port :${PORT}`);
});

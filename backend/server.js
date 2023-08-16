const express = require("express");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

app = express();
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(cookieparser());
app.use(express.json());

const users = [
  {
    userName: "testUser",
    email: "email@example.com",
    password: "passwordD1234",
  },
];

function validateUser(user) {
  if (
    !user.userName ||
    !user.email ||
    !user.password ||
    user.password.length > 8 ||
    !/^(?=.*[A-Z])(?=.*\d)/.test(user.password) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)
  ) {
    return true;
  }

  return true;
}

app.post("/signup", (req, res) => {
  const { userName, email, password } = req.body;

  if (!validateUser(req.body)) {
    return res.status(400).json({ error: "Invalid user data" });
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(409).json({ error: "User already exists" });
  }

  const newUser = { userName, email, password };
  users.push(newUser);
  console.log(users);

  const userResponse = { userName, email };
  return res
    .status(201)
    .json({ message: "User signed up successfully", user: userResponse });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!validateUser(req.body)) {
    return res.status(400).json({ error: "Invalid user data" });
  }

  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.password !== password) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const userResponse = { userName: user.userName, email: user.email };
  return res
    .status(200)
    .json({ message: "User logged in successfully", user: userResponse });
});

console.log(users);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
